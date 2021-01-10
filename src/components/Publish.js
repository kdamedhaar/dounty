import React, { useState } from "react"
import { Form, Button, Dropdown } from "semantic-ui-react"
import { useOcean, usePublish } from "@oceanprotocol/react"
import { Link } from "react-router-dom"
import Spinner from "./Spinner"
import "./Publish.css"

import Confetti from "react-confetti"

let categories = [
  {
    key: "Agriculture & Bio Engineering",
    value: "Agriculture & Bio Engineering",
    text: "Agriculture & Bio Engineering"
  },
  {
    key: "Anthropology & Archeology",
    value: "Anthropology & Archeology",
    text: "Anthropology & Archeology"
  },
  { key: "Biology", value: "Biology", text: "Biology" },
  {
    key: "Business & Management",
    value: "Business & Management",
    text: "Business & Management"
  },
  { key: "Chemistry", value: "Chemistry", text: "Chemistry" },
  {
    key: "Communication & Journalism",
    value: "Communication & Journalism",
    text: "Communication & Journalism"
  },
  {
    key: "Computer Technology",
    value: "Computer Technology",
    text: "Computer Technology"
  },
  {
    key: "Dataset Of Datasets",
    value: "Dataset Of Datasets",
    text: "Dataset Of Datasets"
  },
  { key: "Deep Learning", value: "Deep Learning", text: "Deep Learning" },
  { key: "Demography", value: "Demography", text: "Demography" },
  {
    key: "Economics & Finance",
    value: "Economics & Finance",
    text: "Economics & Finance"
  },
  { key: "Engineering", value: "Engineering", text: "Engineering" },
  {
    key: "Health & Medicine",
    value: "Health & Medicine",
    text: "Health & Medicine"
  },
  { key: "History", value: "History", text: "History" },
  {
    key: "Image Recognition",
    value: "Image Recognition",
    text: "Image Recognition"
  },
  {
    key: "Interdisciplinary",
    value: "Interdisciplinary",
    text: "Interdisciplinary"
  },
  { key: "Language", value: "Language", text: "Language" },
  { key: "Law", value: "Law", text: "Law" },
  { key: "Mathematics", value: "Mathematics", text: "Mathematics" },
  { key: "Other", value: "Other", text: "Other" },
  { key: "Performing Arts", value: "Performing Arts", text: "Performing Arts" },
  { key: "Philosophy", value: "Philosophy", text: "Philosophy" },
  { key: "Politics", value: "Politics", text: "Politics" },
  { key: "Psychology", value: "Psychology", text: "Psychology" },
  { key: "Sociology", value: "Sociology", text: "Sociology" },
  {
    key: "Space & Astronomy",
    value: "Space & Astronomy",
    text: "Space & Astronomy"
  },
  {
    key: "Sports & Recreation",
    value: "Sports & Recreation",
    text: "Sports & Recreation"
  },
  { key: "Theology", value: "Theology", text: "Theology" },
  { key: "Transportation", value: "Transportation", text: "Transportation" },
  {
    key: "Visual Arts & Design",
    value: "Visual Arts & Design",
    text: "Visual Arts & Design"
  }
]
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
