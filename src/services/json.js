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
    
    return false
  }
}

export async function retrieveJSONBucket (filename){
  const file = bucket.file(filename)

  // Faz o download do arquivo como um buffer
  return file.download()
    .then(data => {
      // Define o cabeçalho da resposta
      const jsonData = JSON.parse(data.toString());

      return jsonData
    })
    .catch(err => {
      return false
    });
}


