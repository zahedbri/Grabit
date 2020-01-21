/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component, createRef } from 'react'
import uuid from 'uuid'
import { toast } from 'react-toastify'
import Map from './Map'
import { validateCost } from '../utils'
import { ReactComponent as Add } from '../img/add.svg'
import { ReactComponent as Text } from '../img/text.svg'
import { ReactComponent as Calendar } from '../img/calendar.svg'
import { ReactComponent as Clock } from '../img/clock.svg'
import { ReactComponent as Dollar } from '../img/dollar.svg'
import { ReactComponent as Box } from '../img/box.svg'

class RequestForm extends Component {
  constructor(props) {
    super(props)
    this.addInput = createRef()
    this.state = {
      item: '',
      items: [],
      location: [],
      description: '',
      date: '',
      schedule: '',
      cost: '',
      errors: {
        description: '',
        cost: '',
        schedule: ''
      }
    }
  }

  componentDidMount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude } = position.coords
        const { longitude } = position.coords

        const currentPosition = [longitude, latitude]

        this.setState({ location: currentPosition })
      })
    } else {
      toast.error(`there's no geolocator`)
    }
  }

  handleAddItem = () => {
    const { value: item } = this.addInput.current

    if (item === '') {
      return
    }

    const newItems = [{ id: uuid(), value: item }, ...this.state.items]
    this.setState({ items: newItems, item: '' })
  }

  handleAddItemOnEnter = e => {
    if (e.keyCode === 13) {
      this.handleAddItem()
    }
  }

  handleRemoveItem = id => {
    const oldItems = [...this.state.items]
    const flitered = oldItems.filter(item => item.id !== id)
    this.setState({ items: flitered })
  }

  handleChange = e => {
    const { name, value } = e.target

    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault()

    const { description, cost, items } = this.state

    if (description === '') {
      this.setState({ errors: { description: 'Please Specify your order details' } })
      return
    }

    if (validateCost(cost)) {
      this.setState({ errors: { cost: 'Please specify a valid cost' } })
      return
    }

    if (items.length === 0) {
      toast.error('Please Add items to the list')
      return
    }

    this.setState({ description: '', date: '', schedule: '', cost: '' })
  }

  render() {
    const { item, items, location, description, date, schedule, cost, errors } = this.state

    console.log(location.lng, location.lat)
    return (
      <>
        <h1 className="settings__heading">Request</h1>
        <div className="row p-5">
          <div className="col-lg-6 margin__bottom__mobile--medium">
            <form className="request-form" onSubmit={this.handleSubmit}>
              <div className="request-form__group">
                <label className="request-form__group__label" htmlFor="details">
                  <Text className="request-form__group__label--icon" /> Describe your Order
                </label>
                <textarea
                  className={`request-form__group__textaria form-control ${
                    errors.description ? 'is-invalid' : ''
                  }`}
                  id="details"
                  rows="3"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
                {errors.description && (
                  <div className="invalid-feedback mb-2">{errors.description}</div>
                )}
              </div>
              <label className="request-form__group__label  mt-5" htmlFor="details">
                <Box className="request-form__group__label--icon" /> Order Items List
              </label>
              <div className="request-form__add-item">
                <div>
                  <Add className="request-form__add-item__icon" />
                  <input
                    type="text"
                    ref={this.addInput}
                    placeholder="Add Item"
                    className="request-form__add-item__input"
                    name="item"
                    value={item}
                    onChange={this.handleChange}
                    onKeyDown={this.handleAddItemOnEnter}
                  />
                </div>
                <button
                  type="button"
                  className="request-form__add-item__button"
                  onClick={this.handleAddItem}
                >
                  Add
                </button>
              </div>
              <div className="mt-4">
                {items.map(singleItem => (
                  <div key={singleItem.id} className="request-form__item">
                    <li>{singleItem.value}</li>
                    <div>
                      <button
                        type="button"
                        className="request-form__item__button"
                        onClick={() => this.handleRemoveItem(singleItem.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row my-5">
                <div className="request-form__group col-lg-6 margin__bottom__mobile--small">
                  <label htmlFor="text" className="request-form__group__label">
                    <Clock className="request-form__group__label--icon" /> Date
                  </label>
                  <input
                    type="text"
                    className="form-control request-form__group__input"
                    id="date"
                    name="date"
                    placeholder="ASAP"
                    value={date}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="request-form__group col-lg-6">
                  <label htmlFor="schedule" className="request-form__group__label">
                    <Calendar className="request-form__group__label--icon" /> Schedule
                  </label>
                  <input
                    type="date"
                    className="form-control request-form__group__input"
                    id="schedule"
                    name="schedule"
                    selected={schedule}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="request-form__group">
                <label htmlFor="cost" className="request-form__group__label">
                  <Dollar className="request-form__group__label--icon" /> Order Cost
                </label>
                <input
                  type="text"
                  className={`form-control request-form__group__input ${
                    errors.cost ? 'is-invalid' : ''
                  }`}
                  id="cost"
                  name="cost"
                  placeholder="50"
                  value={cost}
                  onChange={this.handleChange}
                />
                {errors.cost && <div className="invalid-feedback mb-2">{errors.cost}</div>}
              </div>
              <input
                type="submit"
                value="Request"
                className="button button__primary button__block mt-5"
              />
            </form>
          </div>
          <div className="col-lg-6">
            {location.length !== 0 && (
              <Map lat={location[1]} lng={location[0]} height="30rem" width="100%" />
            )}
          </div>
        </div>
      </>
    )
  }
}

export default RequestForm
