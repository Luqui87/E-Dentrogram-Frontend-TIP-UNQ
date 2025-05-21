import { useEffect } from 'react'
import Diente from '../Diente/Diente'
import './Odontograma.css'

function Odontograma( {type,teeth} ){

    function dientes(n, seccion){

        const initial = seccion < 5 ? (seccion - 1 ) * 8 : 32 + (seccion - 5 ) * 5  ;

        return [...Array(n)].map((e, i) => 
            <div className='fila' key={i}>
                <span>{i + 1}</span>
                <Diente seccion={seccion} num={i + 1}
                state={ teeth.find((tooth) => tooth.number ==  initial +  (i + 1 )  )}/>
            </div>
        )
    }

    switch (type){
        case "Mixto":
            return (
            <div className="odontograma mixto">

            <div className="adulto">
                
                <div className="seccion">
                    <div className="dientes">
                        {dientes(8,1)}
                        <span>1</span>
                    </div>
                    
                    <div className="dientes">
                        {dientes(8,2)}
                        <span>2</span>
                    </div>
                </div>
                
                <div className="seccion mixto">
                    <div className="dientes">
                        {dientes(5,5)}
                        <span>5</span>
                    </div>
                    <div className="dientes">
                        {dientes(5,6)}
                        <span>6</span>
                    </div>
                </div>
                
                <div className="seccion mixto">
                    <div className="dientes">
                        {dientes(5,8)}
                        <span>8</span>
                    </div>
                    <div className="dientes">
                        {dientes(5,7)}
                        <span>7</span>
                    </div>
                </div>    
            
                <div className="seccion">
                    <div className="dientes">
                        {dientes(8,4)}
                        <span>4</span>
                    </div>
                    <div className="dientes">
                        {dientes(8,3)}
                        <span>3</span>
                    </div>
                </div>
            
            </div>

        </div>
        
    )
    case "Adulto":
        return(
            <div className="odontograma">

            <div className="adulto">
                
                <div className="seccion">
                    <div className="dientes">
                        {dientes(8,1)}
                        <span>1</span>
                    </div>
                    <div className="dientes">
                        {dientes(8,2)}
                        <span>2</span>
                    </div>
                </div>
            
                <div className="seccion">
                    <div className="dientes">
                        {dientes(8,4)}
                        <span>4</span>
                    </div>
                    <div className="dientes">
                        {dientes(8,3)}
                        <span>3</span>
                    </div>
                </div>
            
            </div>


        </div>
        )

    case "Infante":
        return(
        <div className="odontograma">
            <div className="niñez">
                <div className="seccion">
                    <div className="dientes">
                        {dientes(5,5)}
                        <span>5</span>
                    </div>
                    <div className="dientes">
                        {dientes(5,6)}
                        <span>6</span>
                    </div>
                </div>
                <div className="seccion">
                    <div className="dientes">
                        {dientes(5,8)}
                        <span>8</span>
                    </div>
                    <div className="dientes">
                        {dientes(5,7)}
                        <span>7</span>
                    </div>
                </div>
            </div>
        </div>
        )
    }
    

    
}

export default Odontograma

/* 
<div className="odontograma mixto">

            <div className="adulto">
                
                <div className="seccion">
                    <div className="dientes">
                        {dientes(8,1)}
                        <span>1</span>
                    </div>
                    <div className="dientes">
                        {dientes(8,2)}
                        <span>2</span>
                    </div>
                </div>
            
                <div className="seccion">
                    <div className="dientes">
                        {dientes(8,4)}
                        <span>4</span>
                    </div>
                    <div className="dientes">
                        {dientes(8,3)}
                        <span>3</span>
                    </div>
                </div>
            
            </div>

            <div className="niñez mixto">
                <div className="seccion">
                    <div className="dientes">
                        {dientes(5,5)}
                        <span>5</span>
                    </div>
                    <div className="dientes">
                        {dientes(5,6)}
                        <span>6</span>
                    </div>
                </div>
                <div className="seccion">
                    <div className="dientes">
                        {dientes(5,8)}
                        <span>8</span>
                    </div>
                    <div className="dientes">
                        {dientes(5,7)}
                        <span>7</span>
                    </div>
                </div>
            </div>


        </div>
*/