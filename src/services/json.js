import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: process.env.BUCKET_CREDENTIAL_PATH
});
const bucketName = process.env.GOOGLE_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

function createClientData (row){
  const { id, name, cathegory, plan, district, address, number, complement, duration, vehicle } = row;

  const data = {
      id, 
      name,
      cathegory,
      plan,
      district,
      address,
      number,
      complement,
      availability: {
        SEGUNDA: [],
        TERCA: [],
        QUARTA: [],
        QUINTA: [],
        SEXTA: [],
        SABADO: [],
        DOMINGO: [],
      },
      duration,
      vehicle
  };

  return data
}

function createVehicleData (row){
  const { id, description, capacity, monthly_cost, km_driven_cost, km_driven_emission } = row;

  const data = {
      id, 
      description,
      capacity,
      monthly_cost,
      km_driven_cost,
      km_driven_emission,
      availability: {
        SEGUNDA: [],
        TERCA: [],
        QUARTA: [],
        QUINTA: [],
        SEXTA: [],
        SABADO: [],
        DOMINGO: [],
      }
  };

  return data
}

function createPointCompData (row){
  const { id, name, district, address, number, complement } = row;

  const data = {
      id,
      name,
      district,
      address,
      number,
      complement,
      availability: {
        SEGUNDA: [],
        TERCA: [],
        QUARTA: [],
        QUINTA: [],
        SEXTA: [],
        SABADO: [],
        DOMINGO: [],
      }
  };

  return data
}

function findAvailability (data, day, initialHour, endHour) {

  switch(day){
    case "Segunda-feira":
      data.availability.SEGUNDA.push(`${initialHour} - ${endHour}`)
      break;
    case "Terça-feira":
      data.availability.TERCA.push(`${initialHour} - ${endHour}`)
      break;
    case "Quarta-feira":
      data.availability.QUARTA.push(`${initialHour} - ${endHour}`)
      break;
    case "Quinta-feira":
      data.availability.QUINTA.push(`${initialHour} - ${endHour}`)
      break;
    case "Sexta-feira":
      data.availability.SEXTA.push(`${initialHour} - ${endHour}`)
      break;
    case "Sábado":
      data.availability.SABADO.push(`${initialHour} - ${endHour}`)
      break;
    case "Domingo":
      data.availability.DOMINGO.push(`${initialHour} - ${endHour}`)
      break;
    default:
      break;
  }

  return data
}

function mergeAvailability(data, type) {
  const mergedData = {};
  var key = ""

  data.forEach(eachData => {
    switch (type) {
      case "cliente":
        key = `${eachData.id}_${eachData.name}_${eachData.cathegory}_${eachData.plan}_${eachData.district}_${eachData.address}_${eachData.number}_${eachData.complement}_${eachData.duration}_${eachData.vehicle}`;
        break;
      case "veiculo":
        key = `${eachData.id}_${eachData.description}_${eachData.km_driven_cost}_${eachData.km_driven_emission}`;
        break;
      case "pontoCompostagem":
        key = `${eachData.id}_${eachData.name}_${eachData.district}_${eachData.address}_${eachData.number}_${eachData.complement}`;
        break;
      default:
        break;
    }

    if (!mergedData[key]) {
      // Se ainda não existe, criar uma cópia do cliente
      mergedData[key] = { ...eachData };
    } else {
      // Se já existe, mesclar a disponibilidade
      for (const diaSemana in eachData.availability) {
        mergedData[key].availability[diaSemana] = [
          ...mergedData[key].availability[diaSemana],
          ...eachData.availability[diaSemana]
        ];
      }
    }
  });

  // Converter o objeto de volta para um array
  return Object.values(mergedData);
}

export function createJSON (result, type) {
    const parcialData = []
    const finalData = {}
    var data, dataWithAvailability

    result.forEach((row) => {
      const { day, initialHour, endHour } = row

      switch (type) {
        case "cliente":
          data = createClientData(row)
          dataWithAvailability = findAvailability(data, day, initialHour, endHour)
          parcialData.push(dataWithAvailability)
          break;
        case "veiculo":
          data = createVehicleData(row)
          dataWithAvailability = findAvailability(data, day, initialHour, endHour)
          parcialData.push(dataWithAvailability)
          break;
        case "pontoCompostagem":
          data = createPointCompData(row)
          dataWithAvailability = findAvailability(data, day, initialHour, endHour)
          parcialData.push(dataWithAvailability)
          break;
        default:
          break;
      }
    });

    const mergedParcialData = mergeAvailability(parcialData, type)

    mergedParcialData.forEach((eachData) => {
      const { id } = eachData

      delete eachData.id

      finalData[id] = eachData
    })

    return finalData
}

export async function saveJSONBucket (filename, content){

  const file = bucket.file(filename)

  // Salva o objeto JSON no arquivo do bucket
  try { 
    await file.save(JSON.stringify(content));

    return true
  } catch (error) {
    console.log(error)
    
    return false
  }
}

export async function retrieveJSONBucket (type){
  const [files] = await bucket.getFiles({prefix: "output/"});

  // Define o padrão de nomenclatura do arquivo com base no tipo especificado
  let filePattern;
  if (type === 'all') {
    filePattern = /output_(\d{2}-\d{2}-\d{4})\.json/;
  } else if (type === 'weekly') {
    filePattern = /output_weekly_(\d{2}-\d{2}-\d{4})\.json/;
  } else {
    return false
  }

  // Inicializa variáveis para a data mais recente e o nome do arquivo correspondente
  let latestDate = new Date(0); // data inicial (muito antiga)
  let latestFileName = 'default.json';

  // Itera sobre os arquivos para encontrar o mais recente do tipo especificado
  files.forEach(file => {
      const fileName = file.name;
      const dateStr = fileName.match(filePattern);
      
      if (dateStr) {
          const [_, dateString] = dateStr;
          const [dd, mm, aaaa] = dateString.split('--').join('-').split('-');
          const fileDate = new Date(`${aaaa}-${mm}-${dd}`);
          
          // Compara a data do arquivo com a data mais recente encontrada até agora
          if (fileDate > latestDate) {
              latestDate = fileDate;
              latestFileName = fileName;
          }
      }
  });

  return bucket.file(latestFileName).download()
    .then(data => {
      // Define o cabeçalho da resposta
      const jsonData = {
        filename: latestFileName,
        route: JSON.parse(data.toString())
      };

      return jsonData
    })
    .catch(err => {
      return false
    });
}

export function getTodayDate () {
  var now = new Date();

  return now.toLocaleDateString("pt-br").replaceAll("/", "-");
}




