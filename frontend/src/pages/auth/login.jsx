
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axiosinstance from "../../api"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { Authcontext } from "../../context/Authcontext"



const loginschema = Yup.object().shape({
    
    email: Yup.string().email("invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("password is required")

})

const Login = () => {

    const {login} = useContext(Authcontext)

const navigate = useNavigate();

    const handlesubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await axiosinstance.post("/auth/login", values)
            console.log(res.data);
            login(res.data)
            resetForm();
            alert("Login successsfully")
            navigate("/profile")
        } catch (error) {
            console.log(error);
            alert("Login failed")
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <div className="bg-white min-h-screen flex flex-col justify-center items-center ">
                  <div className="w-md mx-auto   p-6 bg-white rounded shadow">
            <h2 className="text-black text-2xl font-bold mb-4 text-center">Login</h2>
            <Formik initialValues={{  email: "", password: "" }}
                validationSchema={loginschema}
                onSubmit={handlesubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4 text-black">
                    

                        <div>
                               <label className="block mb-1">Email</label>
                            <Field name="email" type="email" className="input w-full input-b" />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>

                          <div>
                               <label className="block mb-1">Password</label>
                            <Field name="password" type="password" className="input w-full input-b" />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                           </div>
                           <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                              {isSubmitting ? "Logging in...": "Login"}
                           </button>
                    </Form>
                )}
            </Formik>
        </div>
        </div>

    )
}

export default Login;