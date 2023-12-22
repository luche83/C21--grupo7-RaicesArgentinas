import PropTypes from 'prop-types'

export const TableItem = ({product : {id, title, category, section, region, price, discount, amount, amountmin}, handleEditForm, handleDeleteProduct}) => {
  return (
    <tr>
          <td>{title}</td>
          <td>{category.title}</td>
          <td>{section.title}</td>
          <td>{region.title}</td>
          <td>{price}</td>
          <td>{discount}</td>
          <td>{amount}</td>
          <td>{amountmin}</td>
          <td>
            <div className='d-flex'>
              
                <button 
                className='btn btn-sm btn-outline-success mr-2'
                onClick={() => handleEditForm(id)}><i className="fa-regular fa-pen-to-square"></i></button>
                <button className='btn btn-sm btn-outline-danger'
                onClick={() => handleDeleteProduct(id)}><i className="fa-solid fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
  )
};

TableItem.propTypes = {
    product : PropTypes.object,
    handleEditForm : PropTypes.func,
    handleDeleteProduct : PropTypes.func
    
}
