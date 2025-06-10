import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion";
import axiosinstance from "../api";
import { useContext, useEffect, useState } from "react";
import { Authcontext } from "../context/Authcontext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";



const pageVariants = {
    hidden: {opacity:0,y:20},
    visible:{
        opacity:1,
        y:0,
        transition:{duration: 0.5,ease: "easeOut"}
    }
    
}

const editcourseschema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    price: Yup.number().required("Price is required"),
    description: Yup.string().required("Price is required"),
    category: Yup.string().required("Category is required"),
})

const Editcourse = () => {
   const navigate = useNavigate()
    const { user } = useContext(Authcontext)
    const {courseid} = useParams();
    
    const[initialValues,setintialValues] = useState({
        title:"",description:"",price: 0,category:""
    })
    

      const fetchinfo = async () => {
            try {
                const {data} = await axiosinstance.get(`/course/${courseid}`, {
                    headers: {
                        Authorization: `Bearer ${user.user.token}`
                    }
                })
                
                 setintialValues({
                   title: data.title,
                   price: data.price,
                   description: data.description,
                   category: data.category
                 })

                console.log(data.price);
              
            } catch (error) {
                console.log("failed to fetch");
            }
        }

        useEffect(() => {
            fetchinfo();
        },[])

    const handlesubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await axiosinstance.put(`/course/${courseid}`, {...values}, {
                headers: {
                    Authorization: `Bearer ${user.user.token}`
                }
            })
            console.log(res.data);
            resetForm();
            toast.success("cousre Edited successsfully")
           navigate("/course-management")
            
        } catch (error) {
            console.log(error);
            toast.error("cousre edit failed")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} variants={pageVariants} className="p-4">
            <motion.h1  className="text-3xl font-bold mb-4 text-center" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.3, duration: 0.4}} >Edit Course</motion.h1>
            <Formik initialValues={initialValues}
                validationSchema={editcourseschema}
                onSubmit={handlesubmit}
                enableReinitialize={true}

            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4 md:w-md mx-auto">
                        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
                            <label className="block mb-1">Title</label>
                            <Field name="title" className="input w-full input-bordered" />
                            <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                        </motion.div>

                        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
                            <label className="block mb-1">Desctiption</label>
                            <Field name="description" className="textarea w-full input-bordered" />
                            <ErrorMessage name=" description" component="div" className="text-red-500 text-sm" />
                        </motion.div>

                        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
                            <label className="block mb-1">Price</label>
                            <Field name="price" type="number" className="input w-full input-bordered" />
                            <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                        </motion.div>


                        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
                            <label className="block mb-1">Category</label>
                            <Field name="category" className="input w-full input-bordered" />
                            <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
                        </motion.div>

                       

                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Editing..." : "Edit"}
                        </button>
                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}

export default Editcourse;