import css from "./NoteForm.module.css"
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService"; 
import { toast } from "react-toastify";



interface NoteFormProps {
    onButtonClose: () => void;
}

interface initialValues {
  title: string;
  content?: string;
  tag: string;
}

export default function NoteForm({ onButtonClose }: NoteFormProps) {
    const queryClient = useQueryClient();
    const fieldId = useId();
    const NoteFormSchema = Yup.object().shape({
        title: Yup.string()
          .min(3, "Title must be at least 3 characters")
          .max(50, "Title is too long")
          .required("Title is required"),
        content: Yup.string()
            .max(500, "Content is too long"),
        tag: Yup.string()
            .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
            .required("Title is required"),
    });
    const defaultValues:initialValues = {
      title: "",
      content: "",
      tag: "Todo"
    }
  
  
    const mutation = useMutation({
      mutationFn: createNote,
      onSuccess: () => {
        toast.success("Note created successfully");
        queryClient.invalidateQueries({ queryKey: ['notesList'] });
        onButtonClose(); 
      },
      onError: () => {
        toast.error("Something went wrong");
      }
    });
      

return (
  <Formik initialValues={defaultValues}
    validationSchema={NoteFormSchema}
        
    onSubmit={(values, { resetForm }) => {
      mutation.mutate(values, {
        onSuccess: () => {
          resetForm();
        },
      });
        }}>
    {({ isSubmitting }) => (
        <Form className={css.form}>
         <div className={css.formGroup}>
             <label htmlFor={`${fieldId}-title`}>Title</label>
             <Field type="text" name="title" id={`${fieldId}-title`} className={css.input}/>
             <ErrorMessage name="title" component="span" className={css.error} />
         </div>
     
         <div className={css.formGroup}>
             <label htmlFor={`${fieldId}-content`}>Content</label>
             <Field as="textarea" name="content" id={`${fieldId}-content`} rows="8" className={css.textarea}/>
             <ErrorMessage name="content" component="span" className={css.error} />
         </div>
       
         <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
                 <Field
                   as="select"
                   name="tag"
                   id={`${fieldId}-tag`}
                   className={css.select}
                 >
                   <option value="Todo">Todo</option>
                   <option value="Work">Work</option>
                   <option value="Personal">Personal</option>
                   <option value="Meeting">Meeting</option>
                   <option value="Shopping">Shopping</option>
                 </Field>
                 <ErrorMessage name="tag" component="span" className={css.error} />
         </div>
     
         <div className={css.actions}>
           <button type="button" className={css.cancelButton} onClick={onButtonClose}>
           Cancel
           </button>
           <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
         >
           Create note
           </button>
         </div>
        </Form>   
   )}     
   
</Formik>

    )
}