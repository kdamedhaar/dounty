import React, { useState } from 'react'
import { Grid, Card, Icon, Form, Radio, Checkbox } from 'semantic-ui-react'
import './ControlPanel.css'
import categories from '../categories'

export default function ControlPanel({ setSort, setFilter }) {
  const [sortby, setSortby] = useState('date')
  const [newChecked, setNewChecked] = useState(true)
  const [activeChecked, setActiveChecked] = useState(true)
  const [completedChecked, setCompletedChecked] = useState(true)

  function handleSort(e, { value }) {
    console.log('Sort changed to - ', value)
    setSortby(value)
    setSort(value)
  }

  function handleFilter(value) {
    switch (value) {
      case 'new':
        setNewChecked(!newChecked)
        setFilter({
          new: !newChecked,
          active: activeChecked,
          completedChecked: completedChecked,
        })
        break
      case 'active':
        setActiveChecked(!activeChecked)
        setFilter({
          new: newChecked,
          active: !activeChecked,
          completedChecked: completedChecked,
        })
        break
      case 'completed':
        setCompletedChecked(!completedChecked)
        setFilter({
          new: newChecked,
          active: activeChecked,
          completedChecked: !completedChecked,
        })
        break
    }
  }
  return (
    <>
      <Grid className='control-container'>
        <Grid.Row key={1} className='card'>
          <Card>
            <Form className='panel-form'>
              <Form.Field>
                <h3>Sort Bounties</h3>
              </Form.Field>
              <Form.Field>
                <Radio
                  label='High Value'
                  name='sort'
                  value='high'
                  checked={sortby === 'high'}
                  onChange={handleSort}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label='Low Value'
                  name='sort'
                  value='low'
                  checked={sortby === 'low'}
                  onChange={handleSort}
                />
              </Form.Field>
              <Form.Field>
                <Radio
                  label='Recent'
                  name='sort'
                  value='date'
                  checked={sortby === 'date'}
                  onChange={handleSort}
                />
              </Form.Field>
            </Form>
            <Form className='panel-form'>
              <Form.Field>
                <h3>Filter Bounties</h3>
              </Form.Field>
              <Form.Field>
                <Checkbox
                  label='New'
                  value='new'
                  onChange={() => handleFilter('new')}
                  checked={newChecked}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  label='Active'
                  value='active'
                  onChange={() => handleFilter('active')}
                  checked={activeChecked}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  label='Completed'
                  value='completed'
                  onChange={() => handleFilter('completed')}
                  checked={completedChecked}
                />
              </Form.Field>
            </Form>
          </Card>
        </Grid.Row>
      </Grid>
    </>
  )
}
