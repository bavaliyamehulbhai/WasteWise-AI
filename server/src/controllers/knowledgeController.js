import KnowledgeSource from "../models/KnowledgeSource.js";
import DisposalRule from "../models/DisposalRule.js";

// ================= SOURCES =================

export const getSources = async (req, res) => {
  try {
    let sources = await KnowledgeSource.find({}).sort({ createdAt: -1 });
    
    // Auto-seed for portfolio demo if empty
    if (sources.length === 0) {
      const demoSources = [
        {
          name: "San Francisco Recology Guide",
          organization: "Recology SF",
          url: "https://www.recology.com/recology-san-francisco/what-goes-where/",
          status: "verified"
        },
        {
          name: "EPA E-Waste Guidelines",
          organization: "U.S. Environmental Protection Agency",
          url: "https://www.epa.gov/recycle/electronics-donation-and-recycling",
          status: "verified"
        },
        {
          name: "Global Composting Standards",
          organization: "World Wildlife Fund",
          url: "https://www.worldwildlife.org/initiatives/food-waste",
          status: "draft"
        }
      ];
      await KnowledgeSource.insertMany(demoSources);
      sources = await KnowledgeSource.find({}).sort({ createdAt: -1 });
    }

    res.json({ success: true, sources });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createSource = async (req, res) => {
  try {
    const { name, organization, url, region } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const source = await KnowledgeSource.create({
      name,
      organization,
      url,
      region
    });

    res.status(201).json({ success: true, source });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateSourceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const source = await KnowledgeSource.findById(req.params.id);

    if (!source) {
      return res.status(404).json({ success: false, message: "Source not found" });
    }

    source.status = status;
    if (status === "verified") {
      source.verifiedAt = new Date();
      source.verifiedBy = req.user._id;
    }

    await source.save();
    res.json({ success: true, source });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================= RULES =================

export const getRules = async (req, res) => {
  try {
    let rules = await DisposalRule.find({})
      .populate("sourceId", "name organization status")
      .sort({ createdAt: -1 });

    // Auto-seed for portfolio demo if empty
    if (rules.length === 0) {
      let source = await KnowledgeSource.findOne();
      
      // Ensure there's at least one source to attach to
      if (!source) {
        source = await KnowledgeSource.create({
          name: "Default Demo Source",
          organization: "Demo Org",
          url: "https://example.com",
          status: "verified"
        });
      }

      const demoRules = [
        {
          category: "Plastic",
          material: "PET Bottles",
          region: "San Francisco",
          accepted: true,
          preparation: "Empty and rinse. Remove caps if not tethered.",
          disposalMethod: "Recycle Bin",
          sourceId: source._id,
          status: "verified"
        },
        {
          category: "E-Waste",
          material: "Lithium Batteries",
          region: "Global",
          accepted: false,
          preparation: "Tape terminals. Do not place in curbside bins.",
          disposalMethod: "Specialized E-Waste Drop-off",
          sourceId: source._id,
          status: "verified"
        },
        {
          category: "Organic",
          material: "Coffee Grounds",
          region: "San Francisco",
          accepted: true,
          preparation: "Remove plastic pods/packaging if applicable.",
          disposalMethod: "Compost Bin",
          sourceId: source._id,
          status: "draft"
        }
      ];
      await DisposalRule.insertMany(demoRules);
      rules = await DisposalRule.find({})
        .populate("sourceId", "name organization status")
        .sort({ createdAt: -1 });
    }

    res.json({ success: true, rules });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createRule = async (req, res) => {
  try {
    const { category, material, region, accepted, preparation, disposalMethod, sourceId } = req.body;

    if (!category || !disposalMethod || !sourceId) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const rule = await DisposalRule.create({
      category,
      material,
      region,
      accepted,
      preparation,
      disposalMethod,
      sourceId
    });

    const populatedRule = await DisposalRule.findById(rule._id).populate("sourceId", "name organization status");
    res.status(201).json({ success: true, rule: populatedRule });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateRuleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const rule = await DisposalRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({ success: false, message: "Rule not found" });
    }

    rule.status = status;
    if (status === "verified") {
      rule.verifiedAt = new Date();
    }

    await rule.save();
    
    const populatedRule = await DisposalRule.findById(rule._id).populate("sourceId", "name organization status");
    res.json({ success: true, rule: populatedRule });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
