from langchain_community.vectorstores import FAISS
import time
import os
def test_retriever(embedding_path, embedding_model, query, retrieved_docs_path):
    start_time = time.time()
    faiss_store = FAISS.load_local(
        embedding_path, embedding_model, allow_dangerous_deserialization=True
    )
    retriever = faiss_store.as_retriever()
    docs = retriever.invoke(query)
    os.makedirs(retrieved_docs_path, exist_ok=True)

    for i, doc in enumerate(docs):
        print(doc.page_content[:25] + "....")
        print("===================")
        file_path = os.path.join(retrieved_docs_path, f'{query[:5]}{i}.md')
        with open(file_path, 'w') as file:
            file.write(doc.page_content)
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Elapsed time: {elapsed_time:.2f} seconds")
        