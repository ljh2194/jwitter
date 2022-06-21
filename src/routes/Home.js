import { dbService, storageSurvice } from "fbInstance";
import React, { useEffect, useRef, useState } from "react";
import { addDoc, collection, getDocs, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"
import Jweet from "components/jweet";

const Home = ({userObj}) => {

    const [jweet, setNweet] = useState("");
    const [jweets, setJweets] = useState([]);
    const [attachment, setAttachment] = useState();

    const getJweets = async () => {
        const dbJweets = await getDocs(collection(dbService, "jweets"));
        dbJweets.forEach((document) => {
            const newJweets = {
                ...document.data(),
                id: document.id
               
            }
            setJweets((prev) => [newJweets, ...prev]);
        });
    }

    useEffect(() => {
        getJweets();
    }, []);

    useEffect(() => {
        
        const q = query(
            collection(getFirestore(), 'jweets'),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            console.log(snapshot)
            const jweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log(jweetArr);
            setJweets(jweetArr);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment != "") {
            const fileRef = ref(storageSurvice, `${userObj.uid}/${uuidv4()}`)
            const response = await uploadString(fileRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }
        const jweetObj = {
            text : jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
             attachmentUrl
        }
        await addDoc(collection(dbService, "jweets"), jweetObj);
        setNweet("");
        setAttachment("");
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }

    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        console.log(theFile);
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget : {result }, } = finishedEvent
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAtachment = (event) => {
        event.preventDefault();
        setAttachment();
        fileInput.current.value = "";
    }
    const fileInput = useRef();
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={jweet} onChange={onChange} placeholder="What's on your mind" maxLength="120" />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                <input type="submit" value="Jweet" />
                {attachment && <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAtachment}>Clear</button>
                </div>}
            </form>
            <div>
                {jweets.map((jweet) => (
                    <Jweet key={jweet.id} jweetObj={jweet} isOwner={jweet.creatorId === userObj.uid}></Jweet>
))}
            </div>
        </div>);
};


export default Home;