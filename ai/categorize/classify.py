from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import AutoModel, AutoTokenizer
import numpy as np

question_type = [ # sentence / keyword
    "幫我生成學習計畫",
    "加入段考期中考",
    "學生常見點錯題",
    "學習重點",
    "生成範例題目",
    "常見題型",
    "幫我在這個計畫的第一周及第三周後裡面安插第一次和第二次段考"
] #list[str]
model_name = 'uer/sbert-base-chinese-nli'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

def get_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=128)
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings.detach().numpy()

def classify(query):
    query_embedding = get_embedding(query)
    type_embeddings = np.vstack([get_embedding(t) for t in question_type])
    similarities = cosine_similarity(query_embedding, type_embeddings)[0]
    print(similarities)
    index = similarities.argmax()
    if similarities.max() < 0.5:
        return False
    return True
    
testing_query = ["幫我生成數學學習計畫", "你好", "學生第三單元常見錯題", "今天天氣如何", "誰是許彥碩"]
for query in testing_query:
    print(classify(query))
