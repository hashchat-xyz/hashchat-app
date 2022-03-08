

const CHAIN = 'polygon';


export function setAccessControlConditions(toAddr: string){
    return ([
         {
             contractAddress: '',
             standardContractType: '',
             CHAIN,
             method: '',
             parameters: [':userAddress'],
             returnValueTest: {
                 comparator: '=',
                 value: toAddr, 
             },
         },
     ]
     )
     
 };
 
