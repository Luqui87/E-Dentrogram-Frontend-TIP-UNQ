import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Odontograma from "./Odontograma";


vi.mock('../Diente/Diente', () => ({
    default: (props) => <div data-testid="diente" data-num={props.num} data-seccion={props.seccion} data-state={JSON.stringify(props.state)}/>
}))

describe('Odontograma', () => {

    const mockedTeeth = [
        {
        up:"MISSING",
        left:"MISSING",
        center:"MISSING",
        right:"MISSING",
        down:"MISSING",
        special: "NOTHING",
        number: 1
        },
        {
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "DENTAL_CROWNS_WITH_ROOT_CANAL_TREATMENT",
        number: 52
        },
    ]

    it('should not render the odontogram', () =>{
        render(<Odontograma active={"inactive"} type={"Mixto"} teeth={mockedTeeth} hasModal={true} />);

        const dientes = screen.queryAllByTestId('diente');

        expect(dientes.length).toBe(52);
        dientes.forEach((d) => {
            expect(d).not.toBeVisible();
        });
        
    })

    it('should render all the teeth type', () =>{
        render(<Odontograma active={"active"} type={"Mixto"} teeth={mockedTeeth} hasModal={true} />);

        const dientes = screen.queryAllByTestId('diente');

        expect(dientes.length).toBe(8*4 + 5*4);
        dientes.forEach((d) => {
            expect(d).toBeVisible();
        });
        
    })

    it('the child tooths should be hiddend', () =>{
        render(<Odontograma active={"active"} type={"Adulto"} teeth={mockedTeeth} hasModal={true} />);

        const dientes = screen.queryAllByTestId('diente');

        expect(dientes.length).toBe(8*4 + 5*4);

        const adult = dientes.slice(0, 15).concat(dientes.slice(36, 51));

        const child = dientes.slice(16, 35);
        
        adult.forEach((d) => {
            expect(d).toBeVisible();
        }); 

        child.forEach((d) => {
            expect(d).not.toBeVisible();
        });
        
    })

    it('the adult tooths should be hiddend', () =>{
        render(<Odontograma active={"active"} type={"Infante"} teeth={mockedTeeth} hasModal={true}/>);

        const dientes = screen.queryAllByTestId('diente');

        expect(dientes.length).toBe(8*4 + 5*4);

        const adult = dientes.slice(0, 15).concat(dientes.slice(36, 51));

        const child = dientes.slice(16, 35);
        
        adult.forEach((d) => {
            expect(d).not.toBeVisible();
        }); 

        child.forEach((d) => {
            expect(d).toBeVisible();
        });
        
    })

    it('should render the teeth at its given position', () =>{
        render(<Odontograma active={"active"} type={"Adulto"} teeth={mockedTeeth} hasModal={true} />);

        const dientes = screen.queryAllByTestId('diente');

        const statesFirst = dientes[0].getAttribute('data-state')

        expect(dientes[0]).toHaveAttribute('data-num', '1');
        expect(dientes[0]).toHaveAttribute('data-seccion', '1');
        expect(JSON.parse(statesFirst)).toEqual(mockedTeeth[0])

        const statesLast = dientes[30].getAttribute('data-state')
        expect(dientes[51]).toHaveAttribute('data-num', '8');
        expect(dientes[51]).toHaveAttribute('data-seccion', '3');
        expect(JSON.parse(statesLast)).toEqual(mockedTeeth[1])
    })

})