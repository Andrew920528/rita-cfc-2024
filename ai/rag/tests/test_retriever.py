import time
import os


def test_retriever(retriever, query, retrieved_docs_path, print_docs=True, save_docs=True):
    start_time = time.time()
    docs = retriever.invoke(query)
    os.makedirs(retrieved_docs_path, exist_ok=True)

    for i, doc in enumerate(docs):
        if print_docs:
            print(doc.page_content[:40] + "....")
            print("===================")

        if save_docs:
            file_path = os.path.join(retrieved_docs_path, f'{query[:5]}{i}.md')
            with open(file_path, 'w') as file:
                file.write(doc.page_content)
    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Elapsed time: {elapsed_time:.2f} seconds")
    return docs
