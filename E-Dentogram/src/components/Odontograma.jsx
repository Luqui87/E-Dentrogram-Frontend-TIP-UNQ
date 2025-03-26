import Diente from './Diente'
import './Odontograma.css'

function Odontograma(){

    function dientes(n, seccion){
        return [...Array(n)].map((e, i) => 
            <div className='fila' key={i}>
                <span>{i + 1}</span>
                <Diente seccion={seccion} num={i + 1}/>
            </div>
        )
    }

    function dientesReverse(n, seccion){ 
        return [...Array(n)].map((e, i) => 
        <div className='fila' key={i}>
            <span>{n - i }</span>
            <Diente seccion={seccion} num={n - i }/>
        </div>
    )
    }

    return(
        <div className="odontograma">

            <div className="adulto">
                
                <div className="seccion">
                    <div className="dientes">
                        <span>1</span>
                        {dientesReverse(8,1)}
                    </div>
                    <div className="dientes">
                        {dientes(8,2)}
                        <span>2</span>
                    </div>
                </div>
            
                <div className="seccion">
                    <div className="dientes">
                        <span>4</span>
                        {dientesReverse(8,4)}
                    </div>
                    <div className="dientes">
                        {dientes(8,3)}
                        <span>3</span>
                    </div>
                </div>
            
            </div>

            <div className="niñez">
                <div className="seccion">
                    <div className="dientes">
                        <span>5</span>
                        {dientesReverse(5)}
                    </div>
                    <div className="dientes">
                        {dientes(5)}
                        <span>6</span>
                    </div>
                </div>
                <div className="seccion">
                    <div className="dientes">
                        <span>8</span>
                        {dientesReverse(5)}
                    </div>
                    <div className="dientes">
                        {dientes(5)}
                        <span>7</span>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Odontograma