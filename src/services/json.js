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
    case "Segunda":
      data.availability.SEGUNDA.push(`${initialHour} - ${endHour}`)
      break;
    case "Terça":
      data.availability.TERCA.push(`${initialHour} - ${endHour}`)
      break;
    case "Quarta":
      data.availability.QUARTA.push(`${initialHour} - ${endHour}`)
      break;
    case "Quinta":
      data.availability.QUINTA.push(`${initialHour} - ${endHour}`)
      break;
    case "Sexta":
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

export function mergeAvailability(data, type) {
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
    const finalData = []
    var data, dataWithAvailability

    result.forEach((row) => {
      const { day, initialHour, endHour } = row

      switch (type) {
        case "cliente":
          data = createClientData(row)
          dataWithAvailability = findAvailability(data, day, initialHour, endHour)
          finalData.push(dataWithAvailability)
          break;
        case "veiculo":
          data = createVehicleData(row)
          dataWithAvailability = findAvailability(data, day, initialHour, endHour)
          finalData.push(dataWithAvailability)
          break;
        case "pontoCompostagem":
          data = createPointCompData(row)
          dataWithAvailability = findAvailability(data, day, initialHour, endHour)
          finalData.push(dataWithAvailability)
          break;
        default:
          break;
      }
    });

    const mergedFinalData = mergeAvailability(finalData, type)

    return mergedFinalData
}
