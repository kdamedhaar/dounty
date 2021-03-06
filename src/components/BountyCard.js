import React from 'react'
import { Card, Icon, Image, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import './BountyCard.css'

export default function BountyCard({
  id,
  name,
  license,
  formats,
  tags,
  description,
  reward,
  status,
  poster,
}) {
  return (
    <Link className='card' to={'/bounty/' + id}>
      <Card fluid style={{ outline: 'none' }}>
        <Card.Content className='cardContent'>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>
            <span>Status - {status}</span>
          </Card.Meta>
          <Card.Description>
            {description.substring(0, 200) + '...'}
          </Card.Description>
        </Card.Content>
        <Card.Content>
          <Card.Meta>
            <span>Posted by - {poster}</span>
          </Card.Meta>
          <Card.Meta>
            <span>Reward - {reward + ' OCEAN'}</span>
          </Card.Meta>
        </Card.Content>
      </Card>
    </Link>
  )
}
