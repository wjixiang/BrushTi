import quizDB from "./quizDB";

describe(quizDB, () => {
    const db = new quizDB

    it.skip("link/close local DB", async()=>{
        await db.connectToDatabase("mongodb://localhost:27017/note_vaults")
            .then((state)=>{expect(state.success).toBe(true)})
        await db.closeDatabase()
            .then((state)=>{expect(state.success).toBe(true)})
    },1000)

    
})