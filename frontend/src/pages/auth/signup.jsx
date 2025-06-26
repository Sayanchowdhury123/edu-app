
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import axiosinstance from "../../api"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }

}

const signupschema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("password is required")

})

const Signup = () => {

    const navigate = useNavigate();

    const handlesubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await axiosinstance.post("/auth/register", values)
            console.log(res.data);
            resetForm();
            toast.success("Register successsfully")
            navigate("/login")
        } catch (error) {
            console.log(error);
            toast.error("Registration failed")
        } finally {
            setSubmitting(false)
        }
    }



    return (
        
            <motion.div initial={{ opacity: 0, y: 20,scale:0.9 }} animate={{ opacity: 1, y: 0,scale:1 }} transition={{duration:0.5}} className="w-md mx-auto bg-base-200  p-8  rounded-2xl mt-50 shadow">
                <motion.h2  className=" text-2xl font-bold mb-4 text-center">Sign Up</motion.h2>
                <Formik initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={signupschema}
                    onSubmit={handlesubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4 ">
                            <div>
                                <label className="block mb-1">Name</label>
                                <Field name="name" className="input w-full input-bordered" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block mb-1">Email</label>
                                <Field name="email" type="email" className="input w-full input-bordered" />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                            </div>

                            <div>
                                <label className="block mb-1">Password</label>
                                <Field name="password" type="password" className="input w-full input-bordered" />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Register"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </motion.div>
        

    )
}

export default Signup;