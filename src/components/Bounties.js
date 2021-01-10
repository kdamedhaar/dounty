import React, { useEffect, useState } from "react"
import { Grid, Header, Image, Card, Icon } from "semantic-ui-react"
import { useParams } from "react-router-dom"
import { useOcean } from "@oceanprotocol/react"
import BountyCard from "./BountyCard"
import ControlPanel from "./ControlPanel"
import Loader from "react-loader-spinner"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "./Bounties.css"
import Spinner from "./Spinner"

export default function Bounties({ config, myAssets }) {
  const [isLoading, setIsLoading] = useState(true)
  const [bounties, setBounties] = useState([])
  const { accountId } = useOcean()
  let { term } = useParams()

  useEffect(() => {
    async function fetchBounties() {
      try {
        const url = `${process.env.REACT_APP_SERVER_URL}/`
        let encodedUrl = encodeURI(url)
        const response = await fetch(encodedUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
        const res = await response.json()
        console.log(res)
        if (response.status == 200) {
          setIsLoading(false)
          //let processedData = await processData(results)
          setBounties(res.data.slice())
        }
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchBounties()
  }, [config])

  function renderLoader() {
    return <Spinner text="Getting Bounties ..." />
  }

  async function processData(datasets) {
    return await Promise.all(
      datasets.map(item => {
        var metadata = item.service[0]
        if (metadata) {
          if (metadata.attributes) {
            var tags = [],
              description = ""
            var { name, author } = metadata.attributes.main
            let extra = metadata.attributes.additionalInformation
            if (extra) {
              tags = extra.tags ? extra.tags.splice(0, 2) : []
              description = extra.description
              var playbackTime = extra.playbackTime
              var posterImage = extra.posterImage
            }

            return {
              name,
              author,
              tags,
              playbackTime,
              posterImage,
              price: Number(item.price.value).toFixed(2),
              ddo: item,
              did: item.id,
              description
            }
          }
        }
      })
    )
  }

  function renderRow(it, index) {
    return (
      <BountyCard
        key={index}
        id={it._id}
        name={it.name}
        license={it.license}
        tags={it.tags}
        formats={it.formats}
        reward={it.reward}
        category={it.category}
        description={it.description}
      />
    )
  }
  return isLoading ? (
    renderLoader()
  ) : bounties.length ? (
    <Grid divided="vertically" className="container">
      <Grid.Row>
        <Grid.Column width={5}>
          <ControlPanel />
        </Grid.Column>
        <Grid.Column width={9}>
          {bounties.map((it, i) => renderRow(it, i))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  ) : (
    <h2 style={{ color: "#f3f3f3", paddingTop: 200 }}>No Bounties found</h2>
  )
}
