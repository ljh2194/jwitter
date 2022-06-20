import { dbService } from "fbInstance";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";
import Jweet from "components/jweet";

const Home = ({userObj}) => {

    const [jweet, setNweet] = useState("");
    const [jweets, setJweets] = useState([]);

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
        await addDoc(collection(dbService, "jweets"), {
            text : jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNweet("");
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="text" value={jweet} onChange={onChange} placeholder="What's on your mind" maxLength="120" />
                <input type="submit" value="Jweet" />
            </form>
            <div>
                {jweets.map((jweet) => (
                    <Jweet key={jweet.id} jweetObj={jweet} isOwner={jweet.creatorId === userObj.uid}></Jweet>
))}
            </div>
        </div>);
};


export default Home;