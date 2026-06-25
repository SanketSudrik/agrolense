using SmartCropAPI.Models;

namespace SmartCropAPI.Data;

public static class DataSeeder
{
    public static void SeedFertilizerRecommendations(AppDbContext context)
    {
        if (context.FertilizerRecommendations.Any()) return;

        var recommendations = new List<FertilizerRecommendation>
        {
            // ═══ Apple Diseases ═══
            new() { DiseaseName = "Apple Scab",        RecommendedFertilizer = "Captan or Mancozeb fungicide",          Description = "Olive-green to black velvety spots on leaves and fruit caused by Venturia inaequalis.",        ApplicationRate = "Apply every 7-10 days from bud break.", Cure = "Prune infected branches. Apply copper-based fungicides.", Prevention = "Plant resistant varieties. Rake and destroy fallen leaves." },
            new() { DiseaseName = "Black Rot",          RecommendedFertilizer = "Sulfur or Copper fungicides",           Description = "Frogeye leaf spots and black rot on fruit caused by Botryosphaeria obtusa.",                    ApplicationRate = "Apply at first sign of disease.", Cure = "Remove cankers and mummified fruit. Apply Thiophanate-methyl.", Prevention = "Good sanitation. Remove dead wood." },
            new() { DiseaseName = "Cedar Apple Rust",   RecommendedFertilizer = "Myclobutanil or Mancozeb",             Description = "Bright yellow-orange spots on leaves. Requires cedar/juniper alternate host.",                  ApplicationRate = "Apply when galls swell in spring.", Cure = "Apply systemic fungicides. Remove cedar galls.", Prevention = "Plant rust-resistant varieties." },

            // ═══ Cherry Diseases ═══
            new() { DiseaseName = "Powdery Mildew",     RecommendedFertilizer = "Sulfur-based fungicide or Neem Oil",   Description = "White powdery coating on leaves reducing photosynthesis.",                                     ApplicationRate = "Apply at first sign, repeat every 10-14 days.", Cure = "Apply potassium bicarbonate sprays. Remove infected parts.", Prevention = "Good air circulation. Avoid overhead watering." },

            // ═══ Corn Diseases ═══
            new() { DiseaseName = "Common Rust",         RecommendedFertilizer = "Triazole or Strobilurin fungicide",    Description = "Cinnamon-brown pustules on both leaf surfaces of corn.",                                       ApplicationRate = "Apply when pustules first appear.", Cure = "Foliar fungicide before tasseling.", Prevention = "Plant resistant hybrids. Early planting." },
            new() { DiseaseName = "Gray Leaf Spot",      RecommendedFertilizer = "Strobilurin + Triazole combination",   Description = "Rectangular gray-tan lesions on corn leaves. Can cause significant yield loss.",                ApplicationRate = "Apply before tasseling.", Cure = "Foliar fungicide at first sign.", Prevention = "Crop rotation. Use resistant hybrids." },
            new() { DiseaseName = "Northern Leaf Blight", RecommendedFertilizer = "Propiconazole or Azoxystrobin",       Description = "Large cigar-shaped grayish-green lesions. Can reduce yields 30-50%.",                          ApplicationRate = "Apply before or at tasseling.", Cure = "Apply fungicides early in disease cycle.", Prevention = "Crop rotation. Residue management." },

            // ═══ Grape Diseases ═══
            new() { DiseaseName = "Grape Black Rot",     RecommendedFertilizer = "Mancozeb or Captan",                  Description = "Small brown circular spots on leaves, black shriveled mummified berries.",                     ApplicationRate = "Apply from bloom to veraison.", Cure = "Remove infected clusters. Apply protectant fungicides.", Prevention = "Canopy management. Remove mummified fruit." },
            new() { DiseaseName = "Esca (Black Measles)", RecommendedFertilizer = "Wound protectant + Trichoderma",     Description = "Chronic fungal trunk disease causing tiger-striped leaves and dark berry spots.",               ApplicationRate = "Apply wound protectant after pruning.", Cure = "No cure. Trunk renewal may help.", Prevention = "Protect pruning wounds. Minimize large cuts." },
            new() { DiseaseName = "Leaf Blight (Isariopsis Leaf Spot)", RecommendedFertilizer = "Mancozeb or Copper spray", Description = "Brown necrotic spots with yellow halos causing premature defoliation.",                ApplicationRate = "Apply before bloom.", Cure = "Remove and destroy infected leaves.", Prevention = "Good canopy management and air flow." },

            // ═══ Orange Diseases ═══
            new() { DiseaseName = "Huanglongbing (Citrus Greening)", RecommendedFertilizer = "Enhanced micronutrient program (Zn, Mn, Fe)", Description = "Devastating bacterial disease spread by Asian citrus psyllid.", ApplicationRate = "Monthly foliar micronutrients.", Cure = "No cure. Remove infected trees. Control psyllids.", Prevention = "Use certified nursery stock. Area-wide psyllid control." },

            // ═══ Peach Diseases ═══
            new() { DiseaseName = "Bacterial Spot",     RecommendedFertilizer = "Copper bactericide + Mancozeb",        Description = "Small dark spots on leaves, stems, fruit with possible yellow halos.",                         ApplicationRate = "Apply every 7-10 days in warm wet weather.", Cure = "Copper sprays. Remove severely infected parts.", Prevention = "Use disease-free transplants. Avoid overhead irrigation." },

            // ═══ Potato Diseases ═══
            new() { DiseaseName = "Early Blight",       RecommendedFertilizer = "Chlorothalonil or Mancozeb",           Description = "Dark concentric ring (target-like) lesions on lower leaves, progressing upward.",               ApplicationRate = "Apply every 7 days in humid weather.", Cure = "Protective fungicides. Remove infected lower leaves.", Prevention = "Crop rotation. Stake plants. Water at base." },
            new() { DiseaseName = "Late Blight",         RecommendedFertilizer = "Mancozeb or Ridomil Gold",            Description = "Water-soaked dark lesions with white fuzzy growth. Can destroy crops in days.",                 ApplicationRate = "Apply immediately at first warning.", Cure = "Destroy infected plants (do NOT compost).", Prevention = "Certified seed potatoes. Monitor weather." },

            // ═══ Squash Diseases ═══
            new() { DiseaseName = "Squash Powdery Mildew", RecommendedFertilizer = "Potassium bicarbonate or Sulfur",   Description = "White powdery spots on squash leaves reducing yield.",                                         ApplicationRate = "Apply at first sign.", Cure = "Neem oil or sulfur sprays. Remove infected leaves.", Prevention = "Resistant varieties. Good air circulation." },

            // ═══ Strawberry Diseases ═══
            new() { DiseaseName = "Leaf Scorch",         RecommendedFertilizer = "Captan or Myclobutanil",              Description = "Dark purple spots that enlarge causing leaf browning and drying.",                              ApplicationRate = "Apply after harvest.", Cure = "Mow and remove old foliage. Thin plants.", Prevention = "Certified disease-free plants. Proper spacing." },

            // ═══ Tomato Diseases ═══
            new() { DiseaseName = "Tomato Early Blight",  RecommendedFertilizer = "Copper Fungicide or Daconil",        Description = "Target-like brown spots on lower leaves caused by Alternaria solani.",                         ApplicationRate = "Spray every 10-14 days.", Cure = "Remove lower leaves. Apply mulch.", Prevention = "Stake plants for better airflow." },
            new() { DiseaseName = "Tomato Late Blight",   RecommendedFertilizer = "Mancozeb or Copper spray",           Description = "Fast-moving oomycete disease causing grey-green water-soaked spots.",                          ApplicationRate = "Weekly during wet weather.", Cure = "Destroy infected plants immediately.", Prevention = "Keep leaves dry. Use resistant cultivars." },
            new() { DiseaseName = "Tomato Bacterial Spot", RecommendedFertilizer = "Copper hydroxide + Mancozeb",       Description = "Small dark raised spots on leaves and fruit caused by Xanthomonas.",                           ApplicationRate = "Apply every 5-7 days.", Cure = "Copper sprays. Remove infected foliage.", Prevention = "Disease-free seed. Avoid overhead watering." },
            new() { DiseaseName = "Leaf Mold",            RecommendedFertilizer = "Chlorothalonil or Copper spray",     Description = "Pale yellow spots on upper surfaces, olive-green mold underneath. Common in greenhouses.",      ApplicationRate = "Apply at first sign.", Cure = "Improve ventilation. Remove infected leaves.", Prevention = "Humidity below 85%. Resistant varieties." },
            new() { DiseaseName = "Septoria Leaf Spot",   RecommendedFertilizer = "Chlorothalonil or Copper fungicide", Description = "Small circular spots with gray centers and dark borders on tomato leaves.",                    ApplicationRate = "Apply every 7-10 days.", Cure = "Remove infected lower leaves. Mulch.", Prevention = "3-year crop rotation. Disease-free transplants." },
            new() { DiseaseName = "Spider Mites (Two-Spotted)", RecommendedFertilizer = "Neem oil or Insecticidal soap", Description = "Tiny pest causing stippled yellowing, fine webbing, and leaf drop.",                       ApplicationRate = "Apply every 5-7 days.", Cure = "Miticides or release predatory mites.", Prevention = "Adequate irrigation. Avoid broad-spectrum insecticides." },
            new() { DiseaseName = "Target Spot",          RecommendedFertilizer = "Azoxystrobin or Difenoconazole",     Description = "Brown target-like lesions with concentric rings causing defoliation.",                         ApplicationRate = "Apply at first sign.", Cure = "Remove heavily infected foliage.", Prevention = "Crop rotation. Proper spacing." },
            new() { DiseaseName = "Yellow Leaf Curl Virus", RecommendedFertilizer = "Neem Oil + Imidacloprid",          Description = "Viral disease (TYLCV) causing severe leaf curling, yellowing, and stunted growth.",             ApplicationRate = "Apply every 5-7 days for whitefly control.", Cure = "No cure. Remove infected plants. Control whiteflies.", Prevention = "TYLCV-resistant varieties. Insect nets." },
            new() { DiseaseName = "Mosaic Virus",         RecommendedFertilizer = "Balanced NPK + Micronutrients",      Description = "Mottled light/dark green mosaic patterns on leaves with distortion.",                          ApplicationRate = "Apply as needed.", Cure = "No cure. Remove and destroy infected plants.", Prevention = "TMV-resistant varieties. Disinfect tools." },

            // ═══ Healthy Plant ═══
            new() { DiseaseName = "Healthy",              RecommendedFertilizer = "Balanced NPK (10-10-10)",            Description = "Plant is healthy with normal leaf coloration and structure.",                                   ApplicationRate = "Once per month during growing season.", Cure = "No treatment needed.", Prevention = "Continue regular care and monitoring." }
        };

        context.FertilizerRecommendations.AddRange(recommendations);
        context.SaveChanges();
    }
}
