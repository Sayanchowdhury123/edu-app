
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axiosinstance from "../../api"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { Authcontext } from "../../context/Authcontext"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
const loginschema = Yup.object().shape({

    email: Yup.string().email("invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("password is required")

})

const Login = () => {

    const { login } = useContext(Authcontext)

    const navigate = useNavigate();

    const handlesubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await axiosinstance.post("/auth/login", values)
           // console.log(res.data);
            login(res.data)
            resetForm();
            toast.success("Login successsfully")
            navigate("/home")
        } catch (error) {
            console.log(error);
            toast.error("Login failed")
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <div className=" min-h-screen flex flex-col justify-center items-center ">
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="w-md mx-auto   p-8  bg-base-200 rounded-2xl shadow">
                <h2 className=" text-2xl font-bold mb-4 text-center">Login</h2>
                <Formik initialValues={{ email: "", password: "" }}
                    validationSchema={loginschema}
                    onSubmit={handlesubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 ">


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
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>

                            <div className="text-center text-primary">
                                <Link to="/signup" className="">don't have a account , create one</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </motion.div>
        </div>

    )
}

export default Login;