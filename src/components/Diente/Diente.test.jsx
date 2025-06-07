import { describe, expect, it, vi } from "vitest";
import Diente from "./Diente";
import { fireEvent, render, waitFor, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import * as ApiModule from '../../service/API';

describe('Diente', () => {


    it('should render a healthy teeth', () => {
        const dom = render(<Diente />)
        const vestibular = dom.container.querySelector('#vestibular')
        const vestibularSon = vestibular?.querySelector('.HEALTHY')

        const distal = dom.container.querySelector('#distal')
        const distalSon = distal?.querySelector('.HEALTHY')

        const centro = dom.container.querySelector('#centro')
        const centroSon = centro?.querySelector('.HEALTHY')

        const mesial = dom.container.querySelector('#mesial')
        const mesialSon = mesial?.querySelector('.HEALTHY')

        const palatino = dom.container.querySelector('#palatino')
        const palatinoSon = vestibular?.querySelector('.HEALTHY')

        expect(vestibularSon).toBeInTheDocument() 
        expect(distalSon).toBeInTheDocument() 
        expect(centroSon).toBeInTheDocument() 
        expect(mesialSon).toBeInTheDocument() 
        expect(palatinoSon).toBeInTheDocument() 

    });


    it('should have a restored vestibular' , () => {
        
        const states = {
        up:"RESTORATION",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "NOTHING",
        number: 10
        };

        const dom = render(<Diente state={states} />)
        const vestibular = dom.container.querySelector('#vestibular');
        const restoration = vestibular?.querySelector('.RESTORATION');

        expect(restoration).toBeInTheDocument();

    });


    it('should have a restored distal' , () => {
        
        const states = {
        up:"HEALTHY",
        left:"RESTORATION",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "NOTHING",
        number: 10
        };

        const dom = render(<Diente state={states} />)
        const distal = dom.container.querySelector('#distal');
        const restoration = distal?.querySelector('.RESTORATION');

        expect(restoration).toBeInTheDocument();

    });

    it('should have a mesial with caries' , () => {
        
        const states = {
        up:"HEALTHY",
        left:"RESTORATION",
        center:"HEALTHY",
        right:"CARIES",
        down:"HEALTHY",
        special: "NOTHING",
        number: 10
        };

        const dom = render(<Diente state={states} />)
        const mesial = dom.container.querySelector('#mesial');
        const caries = mesial?.querySelector('.CARIES');

        expect(caries).toBeInTheDocument();

    });

    it('should have a palatino with caries' , () => {
        
        const states = {
        up:"HEALTHY",
        left:"RESTORATION",
        center:"HEALTHY",
        right:"RESTORATION",
        down:"CARIES",
        special: "NOTHING",
        number: 10
        };

        const dom = render(<Diente state={states} />)
        const palatino = dom.container.querySelector('#palatino');
        const caries = palatino?.querySelector('.CARIES');

        expect(caries).toBeInTheDocument();

    });


    it('should have a missing upper state', () => {
        const states = {
        up:"MISSING",
        left:"MISSING",
        center:"MISSING",
        right:"MISSING",
        down:"MISSING",
        special: "MISSING",
        number: 10
        };

        const dom = render(<Diente state={states} />);
        const missing = dom.container.querySelector('svg.MISSING');
        
        expect(missing).toBeInTheDocument();

    })

    it('should have a missing for no eruption upper state', () => {
        const states = {
        up:"MISSING_NO_ERUPTION",
        left:"MISSING_NO_ERUPTION",
        center:"MISSING_NO_ERUPTION",
        right:"MISSING_NO_ERUPTION",
        down:"MISSING_NO_ERUPTION",
        special: "MISSING_NO_ERUPTION",
        number: 10
        };

        const dom = render(<Diente state={states} />);
        const missing = dom.container.querySelector('svg.MISSING_NO_ERUPTION');
        
        expect(missing).toBeInTheDocument();

    })

    it('should have a extraction upper state', () => {
        const states = {
        up:"EXTRACTION",
        left:"EXTRACTION",
        center:"EXTRACTION",
        right:"EXTRACTION",
        down:"EXTRACTION",
        special: "EXTRACTION",
        number: 10
        };

        const dom = render(<Diente state={states} />);
        const extraction = dom.container.querySelector('svg.EXTRACTION');
        
        expect(extraction).toBeInTheDocument();

    })

    it('should have a to erupt upper state', () => {
        const states = {
        up:"TO_ERUPT",
        left:"TO_ERUPT",
        center:"TO_ERUPT",
        right:"TO_ERUPT",
        down:"TO_ERUPT",
        special: "TO_ERUPT",
        number: 10
        };

        const dom = render(<Diente state={states} />);
        const toErupt = dom.container.querySelector('svg.ERUPT');
        
        expect(toErupt).toBeInTheDocument();

    })
    

    it('should have a dental crowns special state', () => {
        const states = {
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "DENTAL_CROWNS",
        number: 10
        };

        const dom = render(<Diente state={states} />);
        const dentalCrowns = dom.container.querySelector('div.DENTAL_CROWNS');
        
        expect(dentalCrowns).toBeInTheDocument();

    })

    it('should have a dental crowns with root canal treatment special state', () => {
        const states = {
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "DENTAL_CROWNS_WITH_ROOT_CANAL_TREATMENT",
        number: 10
        };

        const dom = render(<Diente state={states} />);
        const dentalCrowns = dom.container.querySelector('div.DENTAL_CROWNS_WITH_ROOT_CANAL_TREATMENT');
        
        expect(dentalCrowns).toBeInTheDocument();

    })

    it('should had the modal close', () => {

        const dom = render(<Diente />);
        const modal = dom.container.querySelector('.modal-outter');
        
        expect(modal).not.toBeInTheDocument();

    })

    it('should not open the tooth modal if has no section', async () =>{

        const dom = render(<Diente />);

        const diente = dom.container.querySelector('.diente.normal');

        act(()=>{
            fireEvent.click(diente)
        })

        await waitFor(()=>{
            const modal = dom.container.querySelector('.modal-outter')
            expect(modal).not.toBeInTheDocument()
        })
    })


    it(' the tooth modal should open when has section', async () =>{

        const dom = render(<Diente seccion={1} />);

        const diente = dom.container.querySelector('.diente.normal');

        act(()=>{
            fireEvent.click(diente)
        })

        await waitFor(()=>{
            const modal = dom.container.querySelector('.modal-outter')
            expect(modal).toBeInTheDocument()
        })
    })

    it('it should update the tooth with caries', async () =>{

        const mockedData = {
        up:"CARIES",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "NOTHING",
        number: 1
        };

        vi.mock('axios', () => ({
            default: {
                request: vi.fn(),
                get: vi.fn(),
                post: vi.fn(),
                defaults: {
                headers: { post: {} },
                baseURL: '',
                timeout: 0,
                }
            }
            }))

        
        axios.request.mockResolvedValue({
        status: 200,
        data: mockedData
        });

        vi.mock('@/service/API', async () => {
            const actual = await vi.importActual('@/service/API');
            return {
                ...actual,
                handleApiError: vi.fn(() => 'Mocked error'),
            };
            });

        const dom = render(<Diente seccion={1} num={1} />);

        const diente = dom.container.querySelector('.diente.normal');

        const vestibular = diente.querySelector('#vestibular div');

        expect(vestibular).toHaveClass('HEALTHY')

        await userEvent.click(diente);

        const modal = dom.container.querySelector('.modal-outter');

        const side = modal?.querySelector('.diente #vestibular div');

        await userEvent.click(side);

        const buttons = screen.getAllByRole("button");

        await userEvent.click(buttons[0]);
    
        expect(side).toHaveClass('CARIES');

        await userEvent.click(buttons[2]);


        expect(vestibular).toHaveClass('CARIES');


    })

    it('it should update the tooth upper state', async () =>{

        const mockedData = {
        up:"MISSING",
        left:"MISSING",
        center:"MISSING",
        right:"MISSING",
        down:"MISSING",
        special: "NOTHING",
        number: 1
        };

        vi.mock('axios', () => ({
            default: {
                request: vi.fn(),
                get: vi.fn(),
                post: vi.fn(),
                defaults: {
                headers: { post: {} },
                baseURL: '',
                timeout: 0,
                }
            }
            }))

        
        axios.request.mockResolvedValue({
        status: 200,
        data: mockedData
        });

        vi.mock('@/service/API', async () => {
            const actual = await vi.importActual('@/service/API');
            return {
                ...actual,
                handleApiError: vi.fn(() => 'Mocked error'),
            };
            });

        const dom = render(<Diente seccion={1} num={1} />);

        const diente = dom.container.querySelector('.diente.normal');

        await userEvent.click(diente);

        const modal = dom.container.querySelector('.modal-outter');

        const selectStates = screen.getAllByRole('state')

        const state = selectStates[2].querySelector('#MISSING')

        await userEvent.click(state);

        const vestibularModal = modal?.querySelector('.diente #vestibular div');

        const svg = modal?.querySelector('.diente svg');
        
        expect(vestibularModal).toHaveClass('MISSING')
        expect(svg).toHaveClass('MISSING')

        const button = screen.getByRole("button");

        expect(button).toHaveTextContent('Confirmar')

        await userEvent.click(button);

        const vestibular = diente.querySelector('#vestibular div');

        const totalState = diente.querySelector('svg.MISSING');

        expect(vestibular).toHaveClass('MISSING'); 
        expect(totalState).toBeInTheDocument();
  
    })

     it('it should update the tooth special state', async () =>{

        const mockedData = {
        up:"HEALTHY",
        left:"HEALTHY",
        center:"HEALTHY",
        right:"HEALTHY",
        down:"HEALTHY",
        special: "DENTAL_CROWNS",
        number: 1
        };

        vi.mock('axios', () => ({
            default: {
                request: vi.fn(),
                get: vi.fn(),
                post: vi.fn(),
                defaults: {
                headers: { post: {} },
                baseURL: '',
                timeout: 0,
                }
            }
        }))

        
        axios.request.mockResolvedValue({
        status: 200,
        data: mockedData
        });

        vi.mock('@/service/API', async () => {
            const actual = await vi.importActual('@/service/API');
            return {
                ...actual,
                handleApiError: vi.fn(() => 'Mocked error'),
            };
            });

        const dom = render(<Diente seccion={1} num={1} />);

        const diente = dom.container.querySelector('.diente.normal');

        await userEvent.click(diente);

        const modal = dom.container.querySelector('.modal-outter');

        const selectStates = screen.getAllByRole('state')

        const state = selectStates[6].querySelector('#DENTAL_CROWNS')

        await userEvent.click(state);

        const specialStateModal = modal?.querySelector('.diente div.DENTAL_CROWNS');
        
        expect(specialStateModal).toBeInTheDocument()

        const button = screen.getByRole("button");

        expect(button).toHaveTextContent('Confirmar')

        await userEvent.click(button);

        const specialState = diente.querySelector('div.DENTAL_CROWNS');

        expect(specialState).toBeInTheDocument();
   
    })

})
