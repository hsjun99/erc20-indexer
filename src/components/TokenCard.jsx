import React from "react"
import { Image, Text, Card, CardBody, Stack, Heading, Box, Divider, Flex } from "@chakra-ui/react"
import { Utils } from "alchemy-sdk"

const TokenCard = ({ tokenDataObject, tokenBalance }) => (
    // <Box rounded="md" boxShadow="lg">
    <Card maxW="sm">
        <CardBody>
            <Stack mt="6" spacing="3">
                <Heading size="md">
                    <Flex gap={1}>
                        {tokenDataObject.logo && (
                            <Image src={tokenDataObject.logo} boxSize="25px" />
                        )}
                        {tokenDataObject.name}
                    </Flex>
                </Heading>
                <Divider />
                <Flex gap={2}>
                    <Text color="blackAlpha.700" fontSize="xl">
                        {parseFloat(
                            parseFloat(
                                Utils.formatUnits(tokenBalance, tokenDataObject.decimals)
                            ).toFixed(4)
                        )}
                    </Text>
                    <Text color="blue.600" fontSize="xl">
                        {tokenDataObject.symbol}
                    </Text>
                </Flex>
            </Stack>
        </CardBody>
    </Card>
    // </Box>
)

export default TokenCard
