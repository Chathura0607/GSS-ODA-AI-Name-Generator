import { AppSettings, BrandManufacturerInfo } from '../types';
import { ProjectScope } from '../constants/projectScopes';
import { analyzeProductImage, lookupBrandManufacturerAndLogo, AnalysisResult } from './gemini';
import { analyzeProductImageWithKie, lookupBrandWithKie } from './kie';
import { lookupBrandWithTinyFish, analyzeProductWithTinyFish } from './tinyfish';

/**
 * Resolves which AI service provider is currently active
 */
export function resolveAiProvider(settings: AppSettings): 'gemini' | 'kie' | 'none' {
  if (settings.aiProvider === 'kie') {
    return settings.kieApiKey?.trim() ? 'kie' : 'none';
  }
  if (settings.aiProvider === 'gemini') {
    return settings.geminiApiKey?.trim() ? 'gemini' : 'none';
  }

  // 'auto' mode:
  // If KIE key is set and Gemini is not, prefer KIE
  if (settings.kieApiKey?.trim() && !settings.geminiApiKey?.trim()) {
    return 'kie';
  }
  if (settings.geminiApiKey?.trim()) {
    return 'gemini';
  }
  if (settings.kieApiKey?.trim()) {
    return 'kie';
  }
  return 'none';
}

/**
 * Returns human-readable status for active AI engine in UI
 */
export function getActiveAiDisplayName(settings: AppSettings): {
  providerName: string;
  modelName: string;
  isActive: boolean;
  providerType: 'gemini' | 'kie' | 'none';
} {
  const provider = resolveAiProvider(settings);
  if (provider === 'kie') {
    return {
      providerName: 'KIE AI',
      modelName: settings.kieModel || 'gpt-4o',
      isActive: true,
      providerType: 'kie',
    };
  }
  if (provider === 'gemini') {
    return {
      providerName: 'Google Gemini',
      modelName: settings.geminiModel || 'gemini-2.5-flash',
      isActive: true,
      providerType: 'gemini',
    };
  }
  return {
    providerName: 'No AI Key',
    modelName: 'Configure in Settings',
    isActive: false,
    providerType: 'none',
  };
}

/**
 * Dispatches image analysis to the active AI provider (Gemini, KIE AI, or TinyFish)
 */
export async function dispatchAnalyzeProductImage(
  dataUrl: string,
  fileName: string,
  settings: AppSettings,
  projectScope?: ProjectScope | null
): Promise<AnalysisResult> {
  const provider = resolveAiProvider(settings);

  if (provider === 'kie') {
    return analyzeProductImageWithKie(
      dataUrl,
      settings.kieApiKey!.trim(),
      settings.kieModel || 'gpt-4o',
      projectScope,
      settings.kieBaseUrl
    );
  }

  if (provider === 'gemini') {
    return analyzeProductImage(
      dataUrl,
      settings.geminiApiKey.trim(),
      settings.geminiModel,
      projectScope
    );
  }

  // Fallback to TinyFish Web Intelligence if key available
  if (settings.tinyFishApiKey?.trim()) {
    return analyzeProductWithTinyFish(fileName, settings.tinyFishApiKey.trim(), projectScope);
  }

  throw new Error(
    'No AI API Key configured. Please click Settings to configure your Google Gemini or KIE AI API Key.'
  );
}

/**
 * Dispatches brand intelligence lookup to the active provider (Gemini, KIE AI, TinyFish, or offline Wikipedia)
 */
export async function dispatchLookupBrand(
  brandName: string,
  settings: AppSettings
): Promise<BrandManufacturerInfo> {
  // If TinyFish search is enabled and tinyFish key is present, and user prefers TinyFish
  if (
    settings.tinyFishApiKey?.trim() &&
    (!settings.geminiApiKey?.trim() && !settings.kieApiKey?.trim() || settings.useTinyFishForSearch)
  ) {
    return lookupBrandWithTinyFish(brandName, settings.tinyFishApiKey.trim());
  }

  const provider = resolveAiProvider(settings);

  if (provider === 'kie') {
    return lookupBrandWithKie(
      brandName,
      settings.kieApiKey!.trim(),
      settings.kieModel || 'gpt-4o',
      settings.kieBaseUrl
    );
  }

  if (provider === 'gemini') {
    return lookupBrandManufacturerAndLogo(
      brandName,
      settings.geminiApiKey.trim(),
      settings.geminiModel
    );
  }

  // Offline fallback with Wikipedia grounding
  return lookupBrandManufacturerAndLogo(brandName, '', settings.geminiModel);
}
