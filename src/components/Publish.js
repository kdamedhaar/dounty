import React, { useState } from "react"
import { Form, Button, Dropdown } from "semantic-ui-react"
import { useOcean, usePublish } from "@oceanprotocol/react"
import { Link } from "react-router-dom"
import Spinner from "./Spinner"
import "./Publish.css"
import categories from "../categories"

import Confetti from "react-confetti"

export default function Register({ config }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reward, setReward] = useState("")
  const [tags, setTags] = useState([])
  const [formats, setFormats] = useState([])
  const [license, setLicense] = useState("")
  const [category, setCategory] = useState("")

  const { publish, publishStepText, isLoading } = usePublish()
  const { accountId } = useOcean()

  const [ddo, setDdo] = useState(null)
  const [data, setData] = useState(null)

  const asset = {
    type: "dataset", //dataset
    name: title,
    dateCreated: Date.now(),
    license,
    description,
    tags,
    category,
    poster: accountId,
    reward,
    formats,
    status: "new",
    workers: {}
  }

  async function saveBounty(e) {
    e.preventDefault()

    let resp = await fetch(`${process.env.REACT_APP_SERVER_URL}/bounty`, {
      method: "POST",
      body: JSON.stringify(asset),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    })

    const res = await resp.json()
    console.log(res)
    setDdo(res.data)
  }

  function renderLoader() {
    return <Spinner />
  }

  function renderSuccess() {
    return (
      <div style={{ paddingTop: 200 }}>
        <Confetti width={4000} height={400} />
        <h3 style={{ color: "#fafafa" }}>
          Your bounty is published successfully 🎉🎉
        </h3>
        <Link to="/">
          <Button color="teal">Go Back</Button>
        </Link>
      </div>
    )
  }

  function renderForm() {
    return (
      <div className="registerContainer">
        <h2 style={{ color: "#f3f3f3" }}>Fill out the bounty details</h2>
        <Form className="registerForm">
          <Form.Field widths="equals">
            <label for="name">Bounty Title</label>
            <input
              id="name"
              placeholder="Title of your bounty"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Field>
          <Form.Field widths="equals">
            <label for="description">Bounty Description</label>
            <Form.TextArea
              id="description"
              placeholder="Tell us more about your bounty. What type of data you want? How many data points? Any special data formats etc.."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="license">Submitted Data license</label>
            <input
              id="license"
              placeholder="MIT"
              value={license}
              onChange={e => setLicense(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="reward">Bounty Reward (in OCEAN)</label>
            <input
              id="reward"
              placeholder="100"
              value={reward}
              onChange={e => setReward(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label for="formats">Expected data formats (comma seperated)</label>
            <input
              id="formats"
              placeholder="csv,pdf,html"
              value={formats}
              onChange={e => setFormats(e.target.value.split(","))}
            />
          </Form.Field>
          <Form.Field>
            <label for="tags">Tags (comma seperated)</label>
            <input
              id="tags"
              placeholder="politics,social"
              value={tags}
              onChange={e => setTags(e.target.value.split(","))}
            />
          </Form.Field>
          <Form.Field>
            <label for="name">Data category</label>
            <Dropdown
              placeholder="Select Category"
              fluid
              selection
              options={categories}
              onChange={e => setCategory(e.target.innerText)}
            />
          </Form.Field>
          <Form.Button color="blue" onClick={e => saveBounty(e)}>
            Publish Bounty
          </Form.Button>
        </Form>
      </div>
    )
  }

  return isLoading ? renderLoader() : ddo ? renderSuccess() : renderForm()
}
