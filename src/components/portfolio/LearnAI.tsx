import { useState, useMemo } from "react";

interface Concept {
  id: string;
  title: string;
  emoji: string;
  category: string;
  short: string;
  detail: string;
  analogy: string;
  keyPoints: string[];
  quiz?: { q: string; options: string[]; answer: number };
}

const CONCEPTS: Concept[] = [
  {
    id: "nn", title: "Neural Networks", emoji: "🧠", category: "Deep Learning",
    short: "Computing systems inspired by biological neural networks",
    detail: "Neural networks consist of layers of interconnected nodes (neurons). Each connection has a weight that adjusts during training. Data flows through input → hidden → output layers, with activation functions introducing non-linearity.",
    analogy: "Think of it like a factory assembly line — raw materials (data) enter, pass through multiple workstations (layers) where workers (neurons) transform them, and a finished product (prediction) comes out.",
    keyPoints: ["Layers: Input, Hidden, Output", "Activation functions: ReLU, Sigmoid, Tanh", "Backpropagation adjusts weights", "Universal approximation theorem"],
    quiz: { q: "What adjusts during neural network training?", options: ["Number of layers", "Weights & biases", "Input data", "Activation functions"], answer: 1 },
  },
  {
    id: "cnn", title: "CNNs", emoji: "👁️", category: "Deep Learning",
    short: "Neural nets specialized for image and spatial data",
    detail: "Convolutional Neural Networks use convolution layers with learnable filters that slide across input data to detect features like edges, textures, and patterns. Pooling layers reduce dimensionality while retaining important features.",
    analogy: "Like looking through a magnifying glass that slides across a photo — at each position, it identifies specific patterns (edges, colors, shapes) and builds up a complete understanding.",
    keyPoints: ["Convolutional filters detect features", "Pooling reduces spatial dimensions", "Feature maps build hierarchically", "Used in: image classification, object detection, segmentation"],
    quiz: { q: "What do convolutional filters detect?", options: ["Colors only", "Features/patterns", "File formats", "Pixel coordinates"], answer: 1 },
  },
  {
    id: "rnn", title: "RNNs & LSTMs", emoji: "🔄", category: "Deep Learning",
    short: "Networks with memory for sequential data",
    detail: "Recurrent Neural Networks process sequential data by maintaining a hidden state that carries information across time steps. LSTMs solve the vanishing gradient problem with gates (forget, input, output) that control information flow.",
    analogy: "Reading a book — you remember previous chapters (hidden state) to understand the current page. LSTMs are like having bookmarks (gates) to decide what to remember, forget, and pay attention to.",
    keyPoints: ["Hidden state carries temporal info", "LSTMs use forget/input/output gates", "GRUs are simplified LSTMs", "Used in: NLP, time-series, speech"],
  },
  {
    id: "transformer", title: "Transformers", emoji: "⚡", category: "Deep Learning",
    short: "Attention-based architecture behind GPT, BERT",
    detail: "Transformers use self-attention to weigh the importance of different parts of the input simultaneously, without sequential processing. Multi-head attention allows the model to focus on different aspects of the data in parallel.",
    analogy: "In a crowded room, instead of listening to one person at a time (RNN), you can hear everyone simultaneously and decide who's most relevant to the conversation (attention).",
    keyPoints: ["Self-attention mechanism", "Positional encoding for sequence order", "Multi-head attention for parallel focus", "Encoder-decoder or decoder-only architectures"],
    quiz: { q: "What mechanism makes Transformers powerful?", options: ["Convolution", "Self-attention", "Recurrence", "Pooling"], answer: 1 },
  },
  {
    id: "rag", title: "RAG", emoji: "📚", category: "GenAI",
    short: "Retrieval-Augmented Generation for grounded AI responses",
    detail: "RAG combines a retrieval system (vector database) with a language model. When a query comes in, relevant documents are retrieved first, then provided as context to the LLM to generate grounded, accurate responses with source attribution.",
    analogy: "Like an open-book exam — instead of relying solely on memory (pre-training), you can look up references (retrieval) before writing your answer (generation).",
    keyPoints: ["Chunks documents → embeddings → vector DB", "Retrieves top-k relevant chunks", "Augments LLM prompt with context", "Reduces hallucinations significantly"],
    quiz: { q: "What does RAG reduce in LLM outputs?", options: ["Speed", "Hallucinations", "Token count", "Training time"], answer: 1 },
  },
  {
    id: "gan", title: "GANs", emoji: "🎨", category: "GenAI",
    short: "Two networks competing to generate realistic data",
    detail: "Generative Adversarial Networks consist of a Generator (creates fake data) and Discriminator (distinguishes real from fake). They train adversarially — the generator improves at fooling the discriminator, which improves at detecting fakes.",
    analogy: "A counterfeiter (generator) tries to make fake money, while a detective (discriminator) tries to catch fakes. Both get better over time until the fakes are indistinguishable from real.",
    keyPoints: ["Generator creates synthetic data", "Discriminator classifies real vs fake", "Minimax game optimization", "Used in: image synthesis, style transfer, data augmentation"],
  },
  {
    id: "rl", title: "Reinforcement Learning", emoji: "🎮", category: "ML",
    short: "Learning through trial, error, and rewards",
    detail: "An agent interacts with an environment, taking actions to maximize cumulative reward. It learns a policy (strategy) through exploration and exploitation, balancing trying new things vs using known good strategies.",
    analogy: "Training a dog — it tries different behaviors, gets treats (rewards) for good ones, and gradually learns the right tricks without being explicitly told what to do.",
    keyPoints: ["Agent, Environment, State, Action, Reward", "Q-Learning: value-based approach", "Policy Gradient: directly optimize policy", "Used in: games, robotics, recommendation systems"],
    quiz: { q: "What does an RL agent maximize?", options: ["Training data", "Cumulative reward", "Network depth", "Batch size"], answer: 1 },
  },
  {
    id: "gradient", title: "Gradient Descent", emoji: "⛰️", category: "Fundamentals",
    short: "The core optimization algorithm for training models",
    detail: "Gradient descent finds the minimum of a loss function by iteratively moving in the direction of steepest descent (negative gradient). The learning rate controls step size. Variants include SGD, Adam, and AdaGrad.",
    analogy: "Imagine you're blindfolded on a hill and need to reach the valley. You feel the slope under your feet (gradient) and take small steps downhill (learning rate) until you reach the bottom (minimum loss).",
    keyPoints: ["Computes partial derivatives of loss", "Learning rate: too big = overshoot, too small = slow", "SGD uses random batches", "Adam adapts learning rate per parameter"],
  },
  {
    id: "overfit", title: "Overfitting vs Underfitting", emoji: "📊", category: "Fundamentals",
    short: "The bias-variance tradeoff in model training",
    detail: "Overfitting: model memorizes training data but fails on new data (high variance). Underfitting: model is too simple to capture patterns (high bias). The goal is finding the sweet spot between complexity and generalization.",
    analogy: "Studying for an exam — memorizing all answers word-for-word (overfitting) vs barely reading the material (underfitting). The best approach is understanding core concepts (good fit).",
    keyPoints: ["Regularization (L1, L2, Dropout)", "Cross-validation for model selection", "Early stopping during training", "Data augmentation increases effective dataset"],
    quiz: { q: "What technique prevents overfitting?", options: ["More layers", "Dropout / Regularization", "Higher learning rate", "Less data"], answer: 1 },
  },
  {
    id: "embeddings", title: "Embeddings", emoji: "📐", category: "NLP",
    short: "Dense vector representations of data",
    detail: "Embeddings map high-dimensional discrete data (words, items) to continuous vector spaces where semantic similarity is preserved. Similar items are close together in the embedding space (e.g., 'king' - 'man' + 'woman' ≈ 'queen').",
    analogy: "Assigning GPS coordinates to every word — words with similar meanings end up in nearby locations on the map, while unrelated words are far apart.",
    keyPoints: ["Word2Vec, GloVe, FastText", "Contextual: BERT, GPT embeddings", "Used in: search, recommendation, clustering", "Foundation for vector databases"],
  },
  {
    id: "clustering", title: "Clustering", emoji: "🎯", category: "ML",
    short: "Grouping similar data points without labels",
    detail: "Unsupervised learning technique that groups data points based on similarity. K-Means assigns points to k centroids, DBSCAN finds density-based clusters, and hierarchical clustering builds a tree of nested groups.",
    analogy: "Sorting a pile of mixed Lego pieces by color and size without being told the categories — you naturally group similar pieces together.",
    keyPoints: ["K-Means: centroid-based, needs k specified", "DBSCAN: density-based, finds outliers", "Silhouette score measures quality", "Used in: segmentation, anomaly detection"],
  },
  {
    id: "llm", title: "Large Language Models", emoji: "💬", category: "GenAI",
    short: "Massive transformer models trained on text corpora",
    detail: "LLMs are transformer-based models with billions of parameters trained on massive text datasets. They predict the next token given context, emerging with capabilities like reasoning, code generation, and instruction following.",
    analogy: "An incredibly well-read person who has consumed every book, article, and webpage — they can continue any conversation by predicting what words naturally come next.",
    keyPoints: ["Pre-training → Fine-tuning → RLHF", "Emergent abilities at scale", "Context window limits input length", "LoRA/QLoRA for efficient fine-tuning"],
    quiz: { q: "What do LLMs predict during generation?", options: ["Entire sentences", "Next token", "Word frequency", "Grammar rules"], answer: 1 },
  },
  {
    id: "mlops", title: "MLOps", emoji: "⚙️", category: "Engineering",
    short: "DevOps practices applied to ML systems",
    detail: "MLOps bridges the gap between ML model development and production deployment. It covers version control for data/models, CI/CD pipelines, monitoring, A/B testing, and automated retraining when model performance degrades.",
    analogy: "If building an ML model is like designing a car engine, MLOps is the entire factory — assembly lines (pipelines), quality control (monitoring), maintenance schedules (retraining), and delivery (deployment).",
    keyPoints: ["Model versioning: MLflow, DVC", "Feature stores for consistent features", "Model monitoring & drift detection", "CI/CD for ML: automated testing & deployment"],
  },
  {
    id: "vectordb", title: "Vector Databases", emoji: "🗃️", category: "Engineering",
    short: "Databases optimized for similarity search on embeddings",
    detail: "Vector databases store high-dimensional vectors (embeddings) and enable fast approximate nearest neighbor (ANN) search. They use indexing algorithms like HNSW and IVF to search billions of vectors in milliseconds.",
    analogy: "A library where books aren't organized alphabetically but by topic similarity — finding related books is instant because similar ones are physically nearby on the shelf.",
    keyPoints: ["ANN algorithms: HNSW, IVF, PQ", "Metadata filtering with vector search", "Used heavily in RAG pipelines", "Examples: Pinecone, Weaviate, Chroma, FAISS"],
  },
  {
    id: "featureeng", title: "Feature Engineering", emoji: "🔧", category: "Data Science",
    short: "Transforming raw data into meaningful model inputs",
    detail: "The process of creating, selecting, and transforming input features to improve model performance. Includes handling missing values, encoding categoricals, scaling numerics, creating interaction features, and dimensionality reduction.",
    analogy: "Preparing ingredients before cooking — washing, peeling, dicing, and seasoning raw ingredients (data) into ready-to-cook components (features) that make the dish (model) delicious.",
    keyPoints: ["One-hot encoding, label encoding", "StandardScaler, MinMaxScaler", "PCA for dimensionality reduction", "Domain knowledge drives best features"],
    quiz: { q: "What does PCA do?", options: ["Adds features", "Reduces dimensions", "Fills missing values", "Encodes categories"], answer: 1 },
  },
  {
    id: "crossval", title: "Cross-Validation", emoji: "🔀", category: "Fundamentals",
    short: "Robust model evaluation technique",
    detail: "K-Fold cross-validation splits data into k subsets. The model trains on k-1 folds and validates on the remaining fold, rotating through all folds. This gives a reliable estimate of model performance and helps detect overfitting.",
    analogy: "Like testing a student with k different exams instead of just one — a single test might be lucky/unlucky, but averaging across many tests gives a true picture of ability.",
    keyPoints: ["K-Fold: typically k=5 or k=10", "Stratified K-Fold preserves class ratios", "Leave-One-Out for tiny datasets", "More reliable than single train/test split"],
  },
  {
    id: "attention", title: "Attention Mechanism", emoji: "🔍", category: "Deep Learning",
    short: "Dynamically focusing on relevant parts of input",
    detail: "Attention computes a weighted sum of values based on query-key compatibility. It allows models to focus on the most relevant parts of the input for each output position. Self-attention relates different positions within the same sequence.",
    analogy: "Reading a document and highlighting important sentences — attention scores are the highlights, helping the model focus on what matters most for each prediction.",
    keyPoints: ["Query, Key, Value matrices", "Softmax produces attention weights", "Scaled dot-product attention", "Multi-head: parallel attention with different projections"],
  },
  {
    id: "prompt", title: "Prompt Engineering", emoji: "✍️", category: "GenAI",
    short: "Crafting effective instructions for LLMs",
    detail: "The art of designing inputs to get desired outputs from language models. Techniques include few-shot examples, chain-of-thought reasoning, system prompts, and structured output formatting.",
    analogy: "Like being a movie director giving instructions to an actor — the clearer and more specific your direction (prompt), the better the performance (output).",
    keyPoints: ["Zero-shot vs few-shot prompting", "Chain-of-thought (CoT) reasoning", "System prompts set behavior/persona", "Temperature controls randomness"],
    quiz: { q: "What does chain-of-thought prompting improve?", options: ["Speed", "Reasoning accuracy", "Token limit", "Cost"], answer: 1 },
  },
  {
    id: "anomaly", title: "Anomaly Detection", emoji: "🚨", category: "Data Science",
    short: "Finding unusual patterns that don't conform to expected behavior",
    detail: "Identifying rare observations that deviate significantly from the majority of data. Methods include statistical (Z-score, IQR), ML-based (Isolation Forest, One-Class SVM), and deep learning (autoencoders).",
    analogy: "A security guard who knows what 'normal' looks like — anything that deviates from typical patterns (unusual transaction, weird network traffic) triggers an alert.",
    keyPoints: ["Isolation Forest: random partitioning", "Autoencoders: high reconstruction error = anomaly", "Statistical: Z-score > 3 = outlier", "Used in: fraud detection, predictive maintenance"],
  },
  {
    id: "etl", title: "ETL Pipelines", emoji: "🔄", category: "Data Science",
    short: "Extract, Transform, Load — the backbone of data engineering",
    detail: "ETL processes move data from source systems (Extract), clean and reshape it (Transform), and load it into a destination (data warehouse). Modern alternatives include ELT where transformation happens after loading.",
    analogy: "A water treatment plant — raw water (data) is extracted from rivers (sources), filtered and treated (transformed), then distributed to homes (data warehouse) for consumption (analysis).",
    keyPoints: ["Extract from APIs, databases, files", "Transform: clean, join, aggregate", "Load into warehouses (Snowflake, BigQuery)", "Orchestration: Airflow, Prefect, dbt"],
  },
  {
    id: "diffusion", title: "Diffusion Models", emoji: "🌊", category: "GenAI",
    short: "How Stable Diffusion and DALL-E generate images",
    detail: "Diffusion models learn to reverse a gradual noising process. During training, noise is progressively added to images. The model learns to predict and remove this noise. During generation, it starts from pure noise and iteratively denoises to produce coherent images.",
    analogy: "Like restoring a painting that's been gradually covered in dust — the model learns how dust accumulates (forward process) so it can carefully clean it off layer by layer (reverse process).",
    keyPoints: ["Forward process: gradually add Gaussian noise", "Reverse process: learned denoising", "U-Net predicts noise at each timestep", "Classifier-free guidance controls quality vs diversity"],
    quiz: { q: "What does the model predict during denoising?", options: ["Pixels directly", "The noise to remove", "Image labels", "Color channels"], answer: 1 },
  },
  {
    id: "finetuning", title: "Fine-Tuning (LoRA/QLoRA)", emoji: "🎯", category: "GenAI",
    short: "Adapting pre-trained models to specific tasks efficiently",
    detail: "Instead of training all billions of parameters, LoRA (Low-Rank Adaptation) freezes the base model and trains small adapter matrices. QLoRA adds 4-bit quantization, allowing fine-tuning of 65B models on a single GPU. Typically trains only 0.1% of total parameters.",
    analogy: "Instead of rebuilding an entire car factory for a new model, you just change the dashboard and seats (adapters) while keeping the engine and frame (base model) unchanged.",
    keyPoints: ["LoRA: low-rank matrix decomposition", "QLoRA: 4-bit quantized base + LoRA", "Rank r controls capacity (r=8-64 typical)", "Merge adapters back for inference"],
  },
  {
    id: "contrastive", title: "Contrastive Learning", emoji: "🔗", category: "Deep Learning",
    short: "Learning representations by comparing similar and dissimilar pairs",
    detail: "Contrastive learning trains models to pull similar examples closer together in embedding space and push dissimilar ones apart. CLIP uses this to align images and text. SimCLR applies augmentations to create positive pairs from the same image.",
    analogy: "Organizing a photo album — you group similar photos together (positive pairs) and separate unrelated ones (negative pairs). Eventually, you develop a sense of visual similarity.",
    keyPoints: ["Positive pairs: same concept, different views", "Negative pairs: different concepts", "InfoNCE loss function", "Foundation of CLIP, SimCLR, DINO"],
    quiz: { q: "What does contrastive learning optimize?", options: ["Classification accuracy", "Distance between similar/dissimilar pairs", "Generation quality", "Training speed"], answer: 1 },
  },
  {
    id: "knowledgegraph", title: "Knowledge Graphs", emoji: "🕸️", category: "Data Science",
    short: "Structured representations of real-world entities and relationships",
    detail: "Knowledge graphs store information as (subject, predicate, object) triples — e.g., (Einstein, bornIn, Germany). They enable complex queries, reasoning, and can enhance LLMs by providing structured context for more accurate and grounded responses.",
    analogy: "A giant mind map where every concept is connected to related concepts with labeled arrows — follow the arrows to discover relationships and answer complex questions.",
    keyPoints: ["Triples: (entity, relation, entity)", "Graph databases: Neo4j, Amazon Neptune", "SPARQL for querying", "Enhances RAG with structured retrieval"],
  },
  {
    id: "federated", title: "Federated Learning", emoji: "🤝", category: "ML",
    short: "Training models across devices without sharing raw data",
    detail: "Federated learning trains models on distributed data (phones, hospitals, banks) without centralizing it. Each device trains locally and sends only model updates (gradients) to a central server, which aggregates them. Data never leaves the device.",
    analogy: "A cooking competition where each chef trains at their own kitchen, then shares only their improved recipes (model updates) — no one sees each other's secret ingredients (raw data).",
    keyPoints: ["Data stays on device (privacy)", "FedAvg: average model updates", "Communication efficiency is key", "Used in: healthcare, mobile keyboards, banking"],
    quiz: { q: "What do devices share in federated learning?", options: ["Raw data", "Model updates/gradients", "Predictions only", "Encrypted data"], answer: 1 },
  },
  {
    id: "mixofexperts", title: "Mixture of Experts (MoE)", emoji: "🧩", category: "Deep Learning",
    short: "Sparse models that activate only a subset of parameters per input",
    detail: "MoE models contain many expert sub-networks but only activate a few for each input via a gating mechanism. This allows massive model capacity (e.g., 1.8T parameters in Switch Transformer) while keeping compute costs similar to a much smaller dense model.",
    analogy: "A hospital with many specialist doctors — for each patient (input), the receptionist (router) sends them to the 2-3 most relevant specialists (experts) instead of every doctor examining every patient.",
    keyPoints: ["Router/gating network selects experts", "Top-k experts activated per token", "Enables larger models at same compute", "Used in Mixtral, Switch Transformer, GPT-4 (rumored)"],
  },
  {
    id: "rlhf", title: "RLHF", emoji: "👍", category: "GenAI",
    short: "Reinforcement Learning from Human Feedback for LLM alignment",
    detail: "RLHF fine-tunes language models using human preferences. Humans rank model outputs, a reward model learns these preferences, then PPO (Proximal Policy Optimization) trains the LLM to maximize the learned reward — making outputs more helpful, honest, and harmless.",
    analogy: "Like training a new employee — they draft emails (LLM outputs), a manager ranks them (human feedback), and the employee learns what 'good' looks like and adjusts their style accordingly.",
    keyPoints: ["Step 1: Supervised fine-tuning (SFT)", "Step 2: Train reward model on human rankings", "Step 3: PPO optimizes LLM against reward model", "DPO as simpler alternative (no reward model)"],
    quiz: { q: "What does the reward model learn from?", options: ["Training data", "Human preference rankings", "Loss functions", "Token probabilities"], answer: 1 },
  },
  {
    id: "graphrag", title: "GraphRAG", emoji: "📊", category: "GenAI",
    short: "Combining knowledge graphs with RAG for structured retrieval",
    detail: "GraphRAG extends traditional RAG by building a knowledge graph from documents, then using graph traversal (not just vector similarity) for retrieval. This captures relationships between entities that flat vector search misses, enabling complex multi-hop reasoning.",
    analogy: "Traditional RAG is like searching a library by keyword. GraphRAG is like having a librarian who understands that 'Einstein's Nobel Prize topic' requires connecting Einstein → Nobel Prize → Photoelectric Effect across multiple books.",
    keyPoints: ["Build KG from documents automatically", "Graph traversal for multi-hop queries", "Community detection for summarization", "Hybrid: vector search + graph retrieval"],
    quiz: { q: "What does GraphRAG add over traditional RAG?", options: ["Faster search", "Relationship-aware retrieval", "Cheaper inference", "Larger context window"], answer: 1 },
  },
  {
    id: "contrastive-learning", title: "Contrastive Learning", emoji: "🔗", category: "Deep Learning",
    short: "Learning representations by comparing similar and dissimilar pairs",
    detail: "Contrastive learning trains models to pull similar examples closer and push dissimilar ones apart in embedding space. SimCLR, MoCo, and CLIP use this to learn powerful representations without labeled data — augmented versions of the same image should have similar embeddings.",
    analogy: "Like organizing a photo album — you group similar photos together and separate different scenes. Over time, you develop an intuitive sense of what 'similar' means without anyone labeling the photos.",
    keyPoints: ["Positive pairs: augmented versions of same input", "Negative pairs: different inputs", "InfoNCE loss function", "Foundation of CLIP, SimCLR, DINO"],
    quiz: { q: "What does contrastive learning optimize?", options: ["Classification accuracy", "Distance between similar/dissimilar pairs", "Generative quality", "Training speed"], answer: 1 },
  },
  {
    id: "knowledge-distillation", title: "Knowledge Distillation", emoji: "🧪", category: "Deep Learning",
    short: "Compressing large models into smaller, faster ones",
    detail: "A large 'teacher' model transfers its knowledge to a smaller 'student' model. Instead of training on hard labels (0 or 1), the student learns from the teacher's soft probability distributions, which contain richer information about inter-class relationships.",
    analogy: "An expert chef (teacher) doesn't just give recipes — they explain why certain ingredients work together, flavor profiles, and subtle techniques. The apprentice (student) learns faster and deeper than from a cookbook alone.",
    keyPoints: ["Teacher produces soft labels (logits)", "Student learns from soft + hard labels", "Temperature parameter controls softness", "Used in: DistilBERT, TinyLlama, mobile deployment"],
    quiz: { q: "What does the student learn from?", options: ["Only hard labels", "Soft probability distributions", "Random noise", "Unlabeled data"], answer: 1 },
  },
  {
    id: "tokenization", title: "Tokenization (BPE/SentencePiece)", emoji: "✂️", category: "GenAI",
    short: "Breaking text into subword units for language models",
    detail: "Byte-Pair Encoding (BPE) and SentencePiece convert text into tokens — subword units the model actually processes. 'unhappiness' might become ['un', 'happi', 'ness']. This balances vocabulary size with the ability to handle any word, including unseen ones.",
    analogy: "Like LEGO bricks — instead of having a unique piece for every possible shape, you use a set of standard bricks (subwords) that can be combined to build anything. Common shapes (words) get their own special piece.",
    keyPoints: ["BPE: iteratively merges frequent character pairs", "Vocabulary size: 32K-100K tokens typical", "Handles OOV words via subword decomposition", "Token count affects cost and context window usage"],
  },
  {
    id: "attention-mechanisms", title: "Attention Mechanisms", emoji: "👁️", category: "Deep Learning",
    short: "Dynamically focusing on relevant parts of input",
    detail: "Attention computes weighted sums where weights indicate relevance. In self-attention, each token attends to all others via Query-Key-Value matrices. Multi-head attention runs multiple attention patterns in parallel, capturing different types of relationships.",
    analogy: "Reading a legal document — when you see 'the aforementioned party', your attention jumps back to find who was mentioned. Each 'head' of multi-head attention looks for different patterns: one tracks pronouns, another tracks dates, another tracks amounts.",
    keyPoints: ["Q, K, V matrices from input embeddings", "Attention = softmax(QK^T/√d)V", "Multi-head: parallel attention patterns", "Flash Attention for memory-efficient computation"],
    quiz: { q: "What do Query and Key matrices compute?", options: ["Token embeddings", "Attention weights/relevance scores", "Output predictions", "Loss gradients"], answer: 1 },
  },
  {
    id: "model-quantization", title: "Model Quantization", emoji: "📦", category: "GenAI",
    short: "Reducing model size by lowering numerical precision",
    detail: "Quantization converts model weights from 32-bit floats to 8-bit integers (or even 4-bit). A 7B parameter model drops from 28GB to 7GB (INT8) or 3.5GB (INT4). Techniques like GPTQ and AWQ minimize quality loss by calibrating on representative data.",
    analogy: "Like compressing a high-res photo to JPEG — you lose some imperceptible detail but the file is 4-8x smaller. The key is choosing what detail to sacrifice while keeping the image looking great.",
    keyPoints: ["INT8: 4x memory reduction, ~1% quality loss", "INT4 (GPTQ/AWQ): 8x reduction, ~2-3% quality loss", "Calibration data improves quantization quality", "Enables running 70B models on consumer GPUs"],
    quiz: { q: "What does INT4 quantization achieve?", options: ["2x speedup", "8x memory reduction", "Better accuracy", "Larger context window"], answer: 1 },
  },
  {
    id: "embedding-spaces", title: "Embedding Spaces", emoji: "🌐", category: "AI/ML",
    short: "Continuous vector representations of discrete data",
    detail: "Embeddings map words, images, or any discrete items into dense vectors where geometric relationships encode semantic meaning. 'king - man + woman ≈ queen' works because the gender direction is consistent in the embedding space.",
    analogy: "Like placing cities on a map — Paris and Lyon are close (both French), Tokyo and Osaka are close (both Japanese), and all cities roughly cluster by continent. The map captures relationships without explicit rules.",
    keyPoints: ["Word2Vec, GloVe for word embeddings", "Sentence-BERT for sentence-level", "Cosine similarity measures relatedness", "Foundation of semantic search and RAG"],
  },
  {
    id: "data-augmentation", title: "Data Augmentation", emoji: "🔄", category: "AI/ML",
    short: "Artificially expanding training data through transformations",
    detail: "Data augmentation applies label-preserving transformations to training data: flipping, rotating, cropping images; synonym replacement, back-translation for text. This reduces overfitting and improves generalization, especially with limited data.",
    analogy: "Like a musician practicing a song in different keys, tempos, and styles — the melody (label) stays the same, but the variations make them a more adaptable performer.",
    keyPoints: ["Image: flip, rotate, crop, color jitter, mixup", "Text: synonym swap, back-translation, random deletion", "Advanced: CutMix, RandAugment, AugMax", "Can 2-5x effective dataset size"],
    quiz: { q: "What must augmentation preserve?", options: ["Image resolution", "The label/class", "File format", "Training speed"], answer: 1 },
  },
  {
    id: "batch-normalization", title: "Batch Normalization", emoji: "📏", category: "Deep Learning",
    short: "Normalizing layer inputs for faster, stabler training",
    detail: "BatchNorm normalizes each layer's inputs to zero mean and unit variance within a mini-batch, then applies learnable scale and shift. This smooths the loss landscape, allowing higher learning rates and reducing sensitivity to initialization.",
    analogy: "Like re-calibrating measuring instruments between factory stages — if each stage outputs values in wildly different ranges, downstream stages struggle. Normalization ensures consistent scales throughout.",
    keyPoints: ["Normalize → Scale → Shift (learnable γ, β)", "Running stats for inference (no batch dependency)", "LayerNorm preferred for Transformers/NLP", "Reduces internal covariate shift"],
  },
  {
    id: "gans", title: "GANs (Generative Adversarial Networks)", emoji: "🎭", category: "Deep Learning",
    short: "Two networks competing to generate realistic data",
    detail: "A Generator creates fake data, a Discriminator tries to distinguish real from fake. Through adversarial training, the Generator learns to produce increasingly realistic outputs. Variants include StyleGAN (faces), CycleGAN (image translation), and Pix2Pix.",
    analogy: "An art forger (Generator) tries to create paintings that fool an art critic (Discriminator). As the critic gets better at spotting fakes, the forger improves their technique — both get better through competition.",
    keyPoints: ["Generator: noise → realistic sample", "Discriminator: classifies real vs fake", "Mode collapse: Generator produces limited variety", "Largely superseded by Diffusion Models for images"],
    quiz: { q: "What is the Discriminator's role?", options: ["Generate images", "Classify real vs fake", "Encode features", "Compute loss"], answer: 1 },
  },
  {
    id: "transfer-learning", title: "Transfer Learning", emoji: "🔀", category: "AI/ML",
    short: "Reusing pre-trained models for new tasks",
    detail: "Instead of training from scratch, start with a model pre-trained on a large dataset (ImageNet, Common Crawl) and fine-tune on your specific task. The pre-trained layers capture general features (edges, textures, syntax) that transfer across domains.",
    analogy: "Like a multilingual person learning a new language — they don't start from zero. They already understand grammar concepts, cognates, and language patterns. Only the specific vocabulary and rules are new.",
    keyPoints: ["Freeze early layers, fine-tune later ones", "Pre-training: large dataset, general features", "Fine-tuning: small dataset, specific task", "Foundation of modern NLP (BERT, GPT) and CV (ResNet)"],
    quiz: { q: "Why does transfer learning work?", options: ["Models memorize all data", "Early layers learn general features", "It uses more compute", "It skips training entirely"], answer: 1 },
  },
  {
    id: "ai-agents", title: "AI Agents", emoji: "🤖", category: "GenAI",
    short: "Autonomous systems that perceive, reason, and act",
    detail: "AI Agents are LLM-powered systems that can autonomously plan, use tools, and take actions to accomplish goals. They follow loops like ReAct (Reason + Act) — the LLM thinks about what to do, calls a tool, observes the result, and repeats until the task is done.",
    analogy: "Like a personal assistant who doesn't just answer questions but actually does things — books flights, sends emails, researches topics — deciding which tools to use and when, adjusting their approach based on results.",
    keyPoints: ["ReAct loop: Think → Act → Observe → Repeat", "Tool use: search, code execution, APIs", "Memory: short-term (conversation) + long-term (vector DB)", "Planning: decompose complex tasks into subtasks"],
    quiz: { q: "What pattern do most AI agents follow?", options: ["Train → Deploy → Monitor", "ReAct: Reason + Act loop", "Map → Reduce → Filter", "Encode → Decode → Generate"], answer: 1 },
  },
  {
    id: "multi-agent", title: "Multi-Agent Systems", emoji: "👥", category: "GenAI",
    short: "Multiple specialized AI agents collaborating on complex tasks",
    detail: "Instead of one agent doing everything, multi-agent systems use specialized agents (researcher, coder, reviewer) that collaborate. A supervisor routes tasks to the right agent, or agents communicate directly. This mirrors human team structures and produces better results on complex tasks.",
    analogy: "Like a software team — the PM (supervisor) assigns tasks, the developer writes code, the QA engineer tests it, and the tech writer documents it. Each specialist excels at their role, and together they ship better products than any individual could.",
    keyPoints: ["Supervisor pattern: orchestrator delegates to specialists", "Debate pattern: agents argue for best answer", "Frameworks: LangGraph, CrewAI, AutoGen", "Shared state for communication between agents"],
    quiz: { q: "What is the supervisor pattern?", options: ["All agents vote on actions", "One agent routes tasks to specialists", "Agents compete for resources", "Sequential pipeline processing"], answer: 1 },
  },
  {
    id: "function-calling", title: "Tool Use & Function Calling", emoji: "🔧", category: "GenAI",
    short: "LLMs choosing and invoking external tools to accomplish tasks",
    detail: "Function calling allows LLMs to output structured JSON that triggers external tools (search, calculator, database, APIs). The model decides WHEN to call a tool, WHICH tool to use, and WHAT arguments to pass — then incorporates the result into its response.",
    analogy: "Like a chef who knows when to use a thermometer, timer, or scale — they don't just rely on intuition but reach for the right tool at the right moment, use it correctly, and incorporate the measurement into their cooking decisions.",
    keyPoints: ["LLM outputs structured tool call JSON", "Tools defined with name, description, parameters", "Parallel tool calls for efficiency", "MCP (Model Context Protocol) for standardized tools"],
  },
  {
    id: "mcp", title: "Model Context Protocol (MCP)", emoji: "🔌", category: "GenAI",
    short: "Universal standard for connecting AI models to tools and data",
    detail: "MCP is an open protocol by Anthropic that standardizes how AI applications connect to external data sources and tools. Like USB-C for AI — instead of building custom integrations for each tool, MCP provides a universal interface that any AI app can use with any MCP-compatible tool server.",
    analogy: "Before USB, every device had its own connector. MCP is the USB-C of AI — one standard protocol that lets any AI model connect to any tool, database, or API through the same interface.",
    keyPoints: ["Client-server architecture: Host → Client → Server", "Resources: read data (files, DB rows)", "Tools: execute actions (search, create, update)", "Prompts: reusable templates with dynamic args"],
    quiz: { q: "What problem does MCP solve?", options: ["Making models faster", "Standardizing AI-tool connections", "Reducing hallucinations", "Training efficiency"], answer: 1 },
  },
  {
    id: "ai-safety", title: "AI Safety & Alignment", emoji: "🛡️", category: "GenAI",
    short: "Ensuring AI systems behave as intended and remain beneficial",
    detail: "AI Safety encompasses techniques to prevent harmful outputs, ensure alignment with human values, and maintain control. This includes RLHF for preference alignment, constitutional AI for self-improvement, red-teaming for vulnerability discovery, and guardrails for production deployment.",
    analogy: "Like the safety systems in a nuclear plant — multiple redundant layers (containment, cooling, monitoring, emergency shutdown) ensure that even if one system fails, the overall system remains safe and under control.",
    keyPoints: ["RLHF / DPO for preference alignment", "Constitutional AI: self-critique against principles", "Red-teaming: adversarial testing for vulnerabilities", "Guardrails: input/output filtering in production"],
  },
  {
    id: "agentic-rag", title: "Agentic RAG", emoji: "🔄", category: "GenAI",
    short: "RAG systems that actively reason about retrieval strategies",
    detail: "Unlike basic RAG (retrieve → generate), Agentic RAG lets an AI agent decide WHEN to retrieve, WHAT to search for, and WHETHER the results are sufficient. The agent can reformulate queries, search multiple sources, combine results, and decide if more retrieval is needed before generating.",
    analogy: "Basic RAG is like a student who always checks one textbook before answering. Agentic RAG is a researcher who decides which databases to search, reformulates queries when results are poor, cross-references multiple sources, and knows when they have enough information.",
    keyPoints: ["Agent decides retrieval strategy dynamically", "Query reformulation for better results", "Multi-source retrieval (web + docs + DB)", "Self-evaluation: 'Do I have enough context?'"],
    quiz: { q: "How does Agentic RAG differ from basic RAG?", options: ["It uses larger models", "Agent decides when/what to retrieve dynamically", "It skips the retrieval step", "It only uses one data source"], answer: 1 },
  },
  {
    id: "speculative-decoding", title: "Speculative Decoding", emoji: "⚡", category: "GenAI",
    short: "Speeding up LLM inference using a smaller draft model",
    detail: "A small 'draft' model quickly generates candidate tokens, then the large 'target' model verifies them in parallel. Since verification is faster than generation, this can 2-3x inference speed with identical output quality — the target model only generates tokens the draft model got wrong.",
    analogy: "Like an assistant who drafts emails for the CEO. The CEO can quickly scan and approve most sentences (fast verification) and only rewrite the few that need changes — much faster than writing every word from scratch.",
    keyPoints: ["Draft model: small, fast (e.g., 1B params)", "Target model: large, accurate (e.g., 70B params)", "Mathematically guaranteed same output distribution", "2-3x speedup with zero quality loss"],
  },
  {
    id: "sparse-attention", title: "Efficient Attention (Flash/Sparse)", emoji: "💨", category: "Deep Learning",
    short: "Making transformer attention faster and memory-efficient",
    detail: "Standard attention is O(n²) in sequence length. Flash Attention uses tiling and kernel fusion to compute exact attention 2-4x faster with less memory. Sparse attention (sliding window, local+global) reduces complexity to O(n) by only attending to relevant positions.",
    analogy: "Standard attention is like everyone in a room talking to everyone else (n² conversations). Flash Attention is the same conversations but organized efficiently. Sparse attention says 'only talk to your neighbors and a few important people.'",
    keyPoints: ["Flash Attention: exact, 2-4x faster, IO-aware", "Sliding window: attend to local context only", "Mistral uses sliding window (4096 tokens)", "Enables 100K+ context lengths practically"],
  },
  {
    id: "synthetic-data", title: "Synthetic Data Generation", emoji: "🏭", category: "GenAI",
    short: "Using AI to generate training data for AI",
    detail: "LLMs can generate high-quality training data: instruction-response pairs, classification examples, preference data for RLHF, and evaluation benchmarks. This reduces reliance on expensive human annotation and enables training specialized models on niche domains.",
    analogy: "Like a flight simulator generating infinite training scenarios for pilots — synthetic data creates realistic training examples without needing real-world data collection, which is expensive and limited.",
    keyPoints: ["Self-Instruct: LLM generates its own training data", "Evol-Instruct: progressively harder examples (WizardLM)", "Distillation: large model generates data for small model", "Quality filtering is crucial — garbage in, garbage out"],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(CONCEPTS.map(c => c.category)))];

export default function LearnAI() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return CONCEPTS.filter(c => {
      const matchCat = selectedCat === "All" || c.category === selectedCat;
      const matchSearch = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.short.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCat, searchQuery]);

  const handleQuiz = (conceptId: string, answerIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [conceptId]: answerIdx }));
  };

  return (
    <div className="learn-container">
      <div className="learn-search-row">
        <input
          className="learn-search"
          placeholder="🔍 Search concepts..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <span className="learn-count">{filtered.length} concepts</span>
      </div>

      <div className="learn-cats">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-chip ${selectedCat === cat ? 'filter-chip--active' : ''}`}
            onClick={() => setSelectedCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="learn-grid">
        {filtered.map(concept => {
          const isExpanded = expandedId === concept.id;
          const quizAnswer = quizAnswers[concept.id];

          return (
            <div
              key={concept.id}
              className={`learn-card ${isExpanded ? 'learn-card--expanded' : ''}`}
              onClick={() => setExpandedId(isExpanded ? null : concept.id)}
            >
              <div className="learn-card-header">
                <span className="learn-card-emoji">{concept.emoji}</span>
                <div className="learn-card-meta">
                  <span className="learn-card-cat">{concept.category}</span>
                  <h3 className="learn-card-title">{concept.title}</h3>
                </div>
                <span className={`learn-chevron ${isExpanded ? 'learn-chevron--open' : ''}`}>↓</span>
              </div>

              <p className="learn-card-short">{concept.short}</p>

              {isExpanded && (
                <div className="learn-card-body" onClick={e => e.stopPropagation()}>
                  <div className="learn-section">
                    <span className="learn-section-label">📖 Explanation</span>
                    <p className="learn-section-text">{concept.detail}</p>
                  </div>

                  <div className="learn-section learn-analogy">
                    <span className="learn-section-label">💡 Analogy</span>
                    <p className="learn-section-text">{concept.analogy}</p>
                  </div>

                  <div className="learn-section">
                    <span className="learn-section-label">🔑 Key Points</span>
                    <ul className="learn-points">
                      {concept.keyPoints.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>

                  {concept.quiz && (
                    <div className="learn-quiz">
                      <span className="learn-section-label">🧪 Quick Quiz</span>
                      <p className="learn-quiz-q">{concept.quiz.q}</p>
                      <div className="learn-quiz-options">
                        {concept.quiz.options.map((opt, i) => {
                          const answered = quizAnswer !== undefined && quizAnswer !== null;
                          const isCorrect = i === concept.quiz!.answer;
                          const isSelected = quizAnswer === i;
                          let cls = "learn-quiz-opt";
                          if (answered && isCorrect) cls += " learn-quiz-opt--correct";
                          if (answered && isSelected && !isCorrect) cls += " learn-quiz-opt--wrong";
                          return (
                            <button
                              key={i}
                              className={cls}
                              onClick={() => !answered && handleQuiz(concept.id, i)}
                              disabled={answered}
                            >
                              {opt}
                              {answered && isCorrect && " ✓"}
                              {answered && isSelected && !isCorrect && " ✗"}
                            </button>
                          );
                        })}
                      </div>
                      {quizAnswer !== undefined && quizAnswer !== null && (
                        <span className={`learn-quiz-result ${quizAnswer === concept.quiz.answer ? 'learn-quiz-result--correct' : 'learn-quiz-result--wrong'}`}>
                          {quizAnswer === concept.quiz.answer ? "🎉 Correct!" : "❌ Try again next time!"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
