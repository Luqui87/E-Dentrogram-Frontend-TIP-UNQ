import Diente from './Diente'
import './Odontograma.css'

function Odontograma(){

    function dientes(n){
        return [...Array(n)].map((e, i) => 
            <div className='fila' key={i}>
                <span>{i + 1}</span>
                <Diente/>
            </div>
        )
    }

    function dientesReverse(n){ 
        return [...Array(n)].map((e, i) => 
        <div className='fila' key={i}>
            <span>{n - i }</span>
            <Diente/>
        </div>
    )
    }

    return(
        <div className="odontograma">

            <div className="adulto">
                
                <div className="seccion">
                    <div className="dientes">
                        <span>1</span>
                        {dientesReverse(8)}
                    </div>
                    <div className="dientes">
                        {dientes(8)}
                        <span>2</span>
                    </div>
                </div>
            
                <div className="seccion">
                    <div className="dientes">
                        <span>4</span>
                        {dientesReverse(8)}
                    </div>
                    <div className="dientes">
                        {dientes(8)}
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