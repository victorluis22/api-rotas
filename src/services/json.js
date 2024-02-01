export function getClientsAvailability (result) {
    const finalData = []
    result.forEach((row) => {
        const { id, name, cathegory, plan, district, address, number, complement, day, initialHour, endHour, duration, vehicle } = row;

        const client = {
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

        switch(day){
            case "Segunda":
            client.availability.SEGUNDA.push(`${initialHour} - ${endHour}`)
            break;
            case "Terça":
            client.availability.TERCA.push(`${initialHour} - ${endHour}`)
            break;
            case "Quarta":
            client.availability.QUARTA.push(`${initialHour} - ${endHour}`)
            break;
            case "Quinta":
            client.availability.QUINTA.push(`${initialHour} - ${endHour}`)
            break;
            case "Sexta":
            client.availability.SEXTA.push(`${initialHour} - ${endHour}`)
            break;
            case "Sábado":
            client.availability.SABADO.push(`${initialHour} - ${endHour}`)
            break;
            case "Domingo":
            client.availability.DOMINGO.push(`${initialHour} - ${endHour}`)
            break;
            default:
            break;
        }

        finalData.push(client)
    });

    return finalData
}

export function mergeAvailabilitySameClient(clientes) {
    const mergedClientes = {};

    clientes.forEach(cliente => {
      const key = `${cliente.id}_${cliente.name}_${cliente.cathegory}_${cliente.plan}_${cliente.district}_${cliente.address}_${cliente.number}_${cliente.complement}_${cliente.duration}_${cliente.vehicle}`;

      if (!mergedClientes[key]) {
        // Se ainda não existe, criar uma cópia do cliente
        mergedClientes[key] = { ...cliente };
      } else {
        // Se já existe, mesclar a disponibilidade
        for (const diaSemana in cliente.avaibility) {
          mergedClientes[key].availability[diaSemana] = [
            ...mergedClientes[key].availability[diaSemana],
            ...cliente.availability[diaSemana]
          ];
        }
      }
    });

    // Converter o objeto de volta para um array
    return Object.values(mergedClientes);
  }