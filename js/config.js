/**
 * Configurações da aplicação e dados dos clientes
 * Estruturado para permitir fácil expansão e adição de novos clientes no futuro.
 */
export const CONFIG = {
  activeClientId: 'senhor_dos_trilhos',
  clients: {
    senhor_dos_trilhos: {
      name: 'Chalés Senhor dos Trilhos',
      chales: [
        {
          id: 'vista_lago',
          name: 'Vista do lago (hidro maior)',
          label: 'Vista do lago',
          sublabel: 'Hidro maior',
          hasHydro: true,
          maxCapacity: 2,
          category: 'COM HIDRO'
        },
        {
          id: 'hortensia',
          name: 'Hortênsia (hidro menor)',
          label: 'Hortênsia',
          sublabel: 'Hidro menor',
          hasHydro: true,
          maxCapacity: 2,
          category: 'COM HIDRO'
        },
        {
          id: 'sem_hidro',
          name: 'Chalés sem hidro',
          label: 'Chalés sem hidro',
          sublabel: 'Comporta até 4 pessoas',
          hasHydro: false,
          maxCapacity: 4,
          category: 'SEM HIDRO'
        }
      ],
      // Datalist de valores comuns em ordem crescente
      datalistValues: [
        350, 490, 590, 700, 710, 750, 850, 980, 990, 
        1050, 1180, 1370, 1470, 1500, 1700, 1770, 2250, 2550
      ],
      // Preenchimento automático para 1 ou 2 pessoas e 1 ou 2 diárias
      autoFillTable: {
        // [diárias]: { [chaléId]: valor }
        1: {
          sem_hidro: 490,
          hortensia: 750,
          vista_lago: 850
        },
        2: {
          sem_hidro: 980,
          hortensia: 1500,
          vista_lago: 1700
        }
      },
      // Templates para cotação
      budgetTemplates: {
        padrao: {
          title: 'Orçamento Padrão',
          checkinTime: '14h',
          checkoutTime: '12h',
          header: '*ORÇAMENTO*'
        },
        dayuse_chale: {
          title: 'Orçamento Day Use com Chalé',
          checkinTime: '09h',
          checkoutTime: '17h',
          header: '*ORÇAMENTO - DAY USE COM CHALÉ*'
        }
      },
      // Day Use - Solicitação de Dados
      dayUseSettings: {
        defaultPricePerPerson: 65,
        priceOptions: [65, 80],
        maxExemptChildren: 2,
        maxExemptAge: 7
      }
    }
  }
};
