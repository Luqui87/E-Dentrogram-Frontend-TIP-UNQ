import { describe, expect, it } from "vitest";
import DienteModal from "./DienteModal";
import { fireEvent, render, waitFor, screen, act } from "@testing-library/react";


describe('DienteModal', ()=>{

    const states = {
        up:"RESTORATION",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "NOTHING",
        upperState : ""
        };


    it('should the tooth modal have the tooth number and section', async () =>{

        const dom = render(<DienteModal diente={states} showModal={true} seccion={1} num={7}/>);


        expect(screen.getByText("Diente 1 7")).toBeVisible()
    })


     it('should the tooth modal have the tooth inside', async () =>{

        const dom = render(<DienteModal diente={states} showModal={true} seccion={1} num={7}/>);

        const modal = dom.container.querySelector('.modal-outter')

        const tooth = modal?.querySelector('.diente')
        expect(tooth).toBeInTheDocument()

       
    })
        



    it('should the tooth modal have the 8 states', async () =>{

        const dom = render(<DienteModal diente={states} showModal={true} seccion={1} num={7}/>);

        const selectStates = screen.getAllByRole('state')

        expect(selectStates[0]).toHaveTextContent('Saludable')
        expect(selectStates[1]).toHaveTextContent('Extracción') 
        expect(selectStates[2]).toHaveTextContent('Ausente') 
        expect(selectStates[3]).toHaveTextContent('Ausente (Por no Erupción)') 
        expect(selectStates[4]).toHaveTextContent('A Erupcionar') 
        expect(selectStates[5]).toHaveTextContent('Implante') 
        expect(selectStates[6]).toHaveTextContent('Corona') 
        expect(selectStates[7]).toHaveTextContent('Corona Filtrada') 
    })

    
    it('the tooth modal should not show the buttons', async () =>{

        const dom = render(<DienteModal diente={states} showModal={true} seccion={1} num={7}/>);

        const modal = dom.container.querySelector('.modal-outter')

        const buttons = modal?.querySelector('.btn-group')
        expect(buttons).not.toBeInTheDocument()

    })


    
    it('the tooth modal should show the buttons when on side is clicked', async () =>{

        const dom = render(<DienteModal diente={states} showModal={true} seccion={1} num={7}/>);

        const modal = dom.container.querySelector('.modal-outter')
        const side = modal.querySelector('.diente #vestibular div')

        act(()=>{
            fireEvent.click(side)
        })

        await waitFor(()=>{


            const buttons = screen.getAllByRole ("button")
            expect(buttons[0]).toHaveTextContent('Carie')
            expect(buttons[1]).toHaveTextContent('Restauracion')

        })
    }) 
})