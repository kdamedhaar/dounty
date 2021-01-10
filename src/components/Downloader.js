import React, { useState, useEffect } from "react"
import { useOcean, useConsume, usePricing } from "@oceanprotocol/react"
import Spinner from "./Spinner"

export default function Download({ ddo, showDownloader }) {
  //const { buyDT, pricingError } = usePricing(ddo)
  const { consumeStepText, consume, consumeError } = useConsume()
  const { ocean, accountId } = useOcean()
  const [stepText, setStepText] = useState(
    "We are starting Download. It might take a while before download completes.."
  )

  useEffect(() => {
    async function handleDownload() {
      try {
        console.log(ddo)
        setStepText("Going to buy Datatoken")
        //await buyDT("1")

        setStepText("Bought Datatoken. Going to Download")

        //await consume(ddo.id, ddo.dataToken, "access", accountId)
        setStepText("Downloading Submission Data")

        //showDownloader(false)
      } catch (err) {
        console.log(err)
      }
    }
    handleDownload()
  }, [ddo])

  return <Spinner text={stepText} top={50} />
}
