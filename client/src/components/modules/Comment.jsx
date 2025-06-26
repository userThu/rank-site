const Comment = (props) => {
    return (
        <div>
            <h6>{props.author}</h6>
            <p>{props.comment}</p>
        </div>
    )
}

export default Comment