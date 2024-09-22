import { Helmet } from "react-helmet-async"

export default function MetaData({title}){
    return (
        <Helmet>
            <title>{`${title} - JVLcart`}</title>   {/* For changing title of the browser icon... */}
        </Helmet>
    )
}