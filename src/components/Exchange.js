import React, { useState, useEffect } from "react"
import { useOcean, useConsume, usePricing } from "@oceanprotocol/react"
import Spinner from "./Spinner"

export default function Exchange({ ddo, price, showLoader }) {
  console.log(ddo)
  const { createPricing } = usePricing(ddo)
  const [stepText, setStepText] = useState(
    "We are starting Download. It might take a while before download completes.."
  )

  const priceOptions = {
    price,
    tokensToMint: "500",
    type: "fixed",
    swapFee: ""
  }

  useEffect(() => {
    async function handlePricing() {
      setStepText("Going to set reward price")
      await createPricing(priceOptions)
      setStepText("Price set")
      showLoader(false)
    }
    handlePricing()
  }, [ddo])

  return <Spinner text={stepText} />
}
