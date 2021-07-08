import React from 'react';

const PaginationComponent = (props) =>{
    const currentPage=props.currentPage

    return(
        <div className='row pt-2'>
            <div className='col-md-4'>
                <nav aria-label='Page navigation example p-0'>
                    <ul className='pagination mb-0'>
                        <li className={`page-item ${props.result?.first ? 'disabled' : ''}`}>
                            <button onClick={props.paginate} type='button' className='page-link'>
                                Əvvəlki
                            </button>
                        </li>
                        {Array.from(Array(props.result?.totalPages).keys()).map((num) => (
                            <li key={num} className={`page-item ${props.result?.number === num ? 'active' : ''}`}>
                                <button onClick={props.paginate(num)} type='button'
                                        className='page-link'>{+num + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${props.result?.last ? 'disabled' : ''}`}>
                            <button onClick={props.paginate} type='button' className='page-link'>
                                Növbəti
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className='col-md-4'>
                <div className='text-muted text-center'>
                        <span>
                          Toplam məlumat:
                            {' '}
                            {props.result?.totalElements}
                        </span>
                </div>
            </div>
        </div>
    )
}

export default PaginationComponent;