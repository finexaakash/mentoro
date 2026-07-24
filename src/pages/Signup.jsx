import { Signup as SignupComponent } from '../../src/components'
function Signup({ studentOnly = false }) {
  return (
    <div className='py-8'>
        <SignupComponent studentOnly={studentOnly} />
    </div>
  )
}

export default Signup
