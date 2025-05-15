import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion";
import axiosinstance from "../api";
import { useContext } from "react";
import { Authcontext } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";




const courseschema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    price: Yup.number().required("Price is required"),
    description: Yup.string().required("Price is required"),
    category: Yup.string().required("Category is required"),
})

const Createcourse = () => {
   const navigate = useNavigate()
    const { user } = useContext(Authcontext)

    const handlesubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await axiosinstance.post("/course", values, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            console.log(res.data);
            resetForm();
            alert("cousre created successsfully")
           navigate("/course-management")
            
        } catch (error) {
            console.log(error);
            alert("cousre creation failed")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Create Course</h1>
            <Formik initialValues={{ title: "", price: 0, description: "", category: "" }}
                validationSchema={courseschema}
                onSubmit={handlesubmit}

            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4 md:w-md mx-auto">
                        <div>
                            <label className="block mb-1">Title</label>
                            <Field name="title" className="input w-full input-bordered" />
                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1">Desctiption</label>
                            <Field name="description" className="textarea w-full input-bordered" />
                            <ErrorMessage name=" description" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div>
                            <label className="block mb-1">Price</label>
                            <Field name="price" type="number" className="input w-full input-bordered" />
                            <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                        </div>


                        <div>
                            <label className="block mb-1">Category</label>
                            <Field name="category" className="input w-full input-bordered" />
                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                        </div>

                       

                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default Createcourse;