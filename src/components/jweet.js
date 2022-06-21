import { dbService } from "fbInstance";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

const Jweet = ({ attachmentUrl, jweetObj, isOwner }) => {
   
    const [editing, setEditing] = useState(false);
    const [newJweet, setNewJweet] = useState(jweetObj.text);

    const JweetTextRef = doc(dbService, "jweets", `${jweetObj.id}`);
    const onDeleteClick = async () => {
        
        const ok = window.confirm("정말 지우시겠습니까?");
        
        if (ok) {
            // delete jweet
            await deleteDoc(JweetTextRef);

        }
    }
    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async(event) => {
        event.preventDefault();

        await updateDoc(JweetTextRef, {
            text : newJweet
        });
        setEditing(false);
    }

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewJweet(value);
    }

    return (
        <div>
            {editing ? (<>
                <form onSubmit={onSubmit}>
                    <input type="text" placeholder="수정하세요" value={newJweet} required onChange={onChange}></input>
                    <input type="submit" value="update Jweet"/>
                </form>
                <button onClick={toggleEditing}>Cancle</button>
            </>) : (<>
                    <h4>{jweetObj.text}</h4>
                    {jweetObj.attachmentUrl && <img src={jweetObj.attachmentUrl} width="50px" height="50px"/>}
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete</button>
                            <button onClick={toggleEditing}>Edit</button>
                        </>
                    )}
                    
            </>)}
        </div>
    );
}
export default Jweet;