import { boolean } from "zod"



const Form = ({ 
  type, post, setPost, submitting, handleSubmit 
}: {
  type: String;
  post: {}; 
  setPost: () => { }; 
  submitting: boolean; 
  handleSubmit: () => { }
}) => {
  return (
    <div>{type} Form</div>
  )
}

export default Form