<?php

namespace App\Support;

use libphonenumber\NumberParseException;
use libphonenumber\PhoneNumberFormat;
use libphonenumber\PhoneNumberUtil;

class PhoneNumberNormalizer
{
    public const DEFAULT_REGION = 'MY';

    protected PhoneNumberUtil $phoneUtil;

    public function __construct(?PhoneNumberUtil $phoneUtil = null)
    {
        $this->phoneUtil = $phoneUtil ?? PhoneNumberUtil::getInstance();
    }

    public function normalize(?string $value, ?string $region = null): ?string
    {
        if (empty($value)) {
            return null;
        }

        $region = $region ?: static::DEFAULT_REGION;

        $candidates = $this->generateCandidates($value);

        foreach ($candidates as $candidate) {
            if (empty($candidate)) {
                continue;
            }

            try {
                $number = $this->phoneUtil->parse($candidate, $region);
                if ($this->phoneUtil->isValidNumber($number)) {
                    return $this->phoneUtil->format($number, PhoneNumberFormat::E164);
                }
            } catch (NumberParseException $exception) {
                continue;
            }
        }

        return trim($value);
    }

    protected function generateCandidates(string $value): array
    {
        $trimmed = trim($value);
        $sanitized = preg_replace('/[\s\-()\.]+/', '', $trimmed);
        $sanitized = preg_replace('/^00/', '+', $sanitized);

        $candidates = [];

        if (!empty($sanitized)) {
            $candidates[] = $sanitized;

            if (!str_starts_with($sanitized, '+')) {
                $candidates[] = '+' . $sanitized;
            }

            if (str_starts_with($sanitized, '01')) {
                $candidates[] = '+6' . $sanitized;
            }
        }

        $candidates[] = $trimmed;

        return array_unique(array_filter($candidates));
    }
}


