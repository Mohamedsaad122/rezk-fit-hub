# Feature Flags Guide

Gradual rollout policies, tenant subscription checks, and percentage overrides.

## Usage
```javascript
import FeatureFlagsService from '@/services/feature-flags.service';

const isAllowed = await FeatureFlagsService.isEnabled('nutritionModule', 1);
```
