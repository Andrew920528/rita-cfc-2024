from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

question_type = [
    "what is that",
    "where is that",
    "how is that",
    "who is that",
    "when is that"
] #list[str]
def classify(query):
    model = SentenceTransformer('all-MiniLM-L6-v2')
    query_embedding = model.encode(query)
    type_embeddings = model.encode(question_type)
    similarities = cosine_similarity([query_embedding], type_embeddings)[0]
    index = similarities.argmax()
    return question_type[index]
    
query = input("")
print(classify(query))