import module namespace api = "http://apps.28.io/api";

let $hierarchy := api:parameter("list", "*", ())
let $record := find("reportschemas", { "_id" : "Disclosures" })
for $network in $record.Networks[]
return 
    if ($network.LinkName = "link:presentationLink") then
    [
        if (exists($hierarchy)) then
            let $item := $network("Trees")("disc:DisclosuresLineItems")("To")("disc:" || $hierarchy || "Hierarchy")("To")
            return keys($item) ! jn:project($item.$$, ("Name", "Label"))
        else
            let $item := $network("Trees")("disc:DisclosuresLineItems")("To")
            for $key in keys($item)
            for $k in keys($item($key)("To")) ! $item($key)("To").$$
            group by $k.Name
            return jn:project($k[1], ("Name", "Label"))
    ]
    else ()
