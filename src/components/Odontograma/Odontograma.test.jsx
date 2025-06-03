import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Odontograma from "./Odontograma";

describe('Odontograma', () => {

    it('should render the adult type', () =>{
        const dom = render(<Odontograma active={"active"} type={"Adulto"} teeth={[]} />);

        const seccion = dom.container.querySelector('.seccion.adulto.ADULTO');

        expect(seccion).not.toBeInTheDocument();
        
    })

})