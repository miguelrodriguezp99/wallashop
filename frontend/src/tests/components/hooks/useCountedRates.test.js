import { renderHook } from '@testing-library/react';
import useCountedRates from '../../../modules/app/hooks/useCountedRates'; 
import { act } from 'react-dom/test-utils';

//Se está mockeando (simular una función) getNrates para asi devuelva datos simulados
//En este caso se devuelve un objeto con un total de 10 rates y un average de 5 (por ejemplo)
jest.mock('../../../backend/postService', () => ({
    getNRates: jest.fn().mockResolvedValue({
      totalRates: 10,
      averageRate: 5,
    }),
}));
  
const { getNRates } = require('../../../backend/postService');
  
describe('useCountedRates', () => {
    it('matches snapshot', async () => {
        const id = 123;
        //Se usa renderHook para renderizar el hook (useCountedRates)
        //Se mete un id como argumento
        const { result } = renderHook(() => useCountedRates(id));

        //Aqui se comprueba que se ha llamado a getNRates con el id y las dos funciones que se pasan como argumento
        // (una para manejar el exito y otra para manejar el error)
        expect(getNRates).toHaveBeenCalledWith(id, expect.any(Function), expect.any(Function));

        //Se usa act para esperar a que se resuelva la promesa simulada "setTimeout"
        //act se usa para "sincronizar" las acciones que causan las actalizaciones en el arbol de componentes
        //react espera que todas las actualizaciones de estado se completen antes de continuar con el test
        //Por tanto se usa setTimeout para ejecutar la función despues de un retraso "0" en este caso
        //De esta forma se simula una operación asíncrona que se completa despues de que la pila de ejecución actual
        //se haya vaciado, lo que permite que react pueda procesar las actualizaciones pendientes.
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0)); 
        });

        //Aqui se comprueba si el resultado del hook concuerda con el snapshot
        expect(result.current).toMatchSnapshot();
    });
});


