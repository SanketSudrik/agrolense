using Microsoft.ML.OnnxRuntime;

namespace SmartCropAPI.Services;

/// <summary>
/// Singleton pool that lazily loads ONNX InferenceSession objects on first use
/// and caches them for the lifetime of the application.
/// This implements "Model Lazy Loading" — specialist models are only loaded into
/// RAM when the Router actually routes an image to that specialist.
/// </summary>
public sealed class ModelSessionPool : IDisposable
{
    private readonly Dictionary<string, InferenceSession?> _sessions = new();
    private readonly SemaphoreSlim _lock = new(1, 1);
    private readonly ILogger<ModelSessionPool> _logger;
    private bool _disposed;

    public ModelSessionPool(ILogger<ModelSessionPool> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Returns an InferenceSession for the given model file path.
    /// If the session has not been loaded yet, it is loaded now (lazy).
    /// Returns null if the model file does not exist.
    /// </summary>
    public async Task<InferenceSession?> GetOrLoadAsync(string modelPath)
    {
        if (_disposed) throw new ObjectDisposedException(nameof(ModelSessionPool));

        await _lock.WaitAsync();
        try
        {
            // Already cached (even if null = file was missing)
            if (_sessions.TryGetValue(modelPath, out var cached))
                return cached;

            if (!File.Exists(modelPath))
            {
                _logger.LogWarning("[ModelPool] Model file not found: {Path}", modelPath);
                _sessions[modelPath] = null;
                return null;
            }

            _logger.LogInformation("[ModelPool] Lazy-loading model into RAM: {Path}", Path.GetFileName(modelPath));
            var sw = System.Diagnostics.Stopwatch.StartNew();

            // SessionOptions — optimised for laptop CPU inference
            var opts = new Microsoft.ML.OnnxRuntime.SessionOptions();
            opts.InterOpNumThreads = Math.Max(1, Environment.ProcessorCount / 2);
            opts.IntraOpNumThreads = Math.Max(1, Environment.ProcessorCount / 2);
            opts.GraphOptimizationLevel = GraphOptimizationLevel.ORT_ENABLE_ALL;

            var session = new InferenceSession(modelPath, opts);
            _sessions[modelPath] = session;

            sw.Stop();
            _logger.LogInformation("[ModelPool] Loaded {File} in {Ms}ms",
                Path.GetFileName(modelPath), sw.ElapsedMilliseconds);

            return session;
        }
        finally
        {
            _lock.Release();
        }
    }

    /// <summary>Checks whether a model file exists (does not load it).</summary>
    public bool ModelExists(string modelPath) => File.Exists(modelPath);

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        _lock.Wait();
        try
        {
            foreach (var kvp in _sessions)
                kvp.Value?.Dispose();
            _sessions.Clear();
        }
        finally
        {
            _lock.Release();
            _lock.Dispose();
        }
    }
}
