import module namespace api = "http://apps.28.io/api";

let $concept := api:required-parameter("concept", "*:*")
let $record := find("reportschemas", { "_id" : "Disclosures" })
for $network in $record.Networks[]
return 
    if ($network.LinkName = "link:definitionLink") then
    trim({|
        $network("Trees")($concept),
        { Label: $record("Hypercubes")("xbrl:DefaultHypercube")("Aspects")("xbrl:Concept")("Domains")("xbrl:ConceptDomain")("Members")($concept).Label }
    |}, "Id")
    else ()