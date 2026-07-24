import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
export default function Protected({children, authentication = true, loginPath = "/login"}) {
    const navigate = useNavigate()
    const location = useLocation()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate(loginPath, { replace: true, state: { from: location.pathname } })
        } else if(!authentication && authStatus !== authentication){
            navigate("/", { replace: true })
        }
        setLoader(false)
    }, [authStatus, navigate, authentication, location.pathname, loginPath])

  if (loader) return <h1>Loading...</h1>
  if (authentication && !authStatus) return null
  if (!authentication && authStatus) return null
  return <>{children}</>
}
