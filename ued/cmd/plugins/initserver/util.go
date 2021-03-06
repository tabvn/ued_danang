package initserver

import (
	"go/build"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

func PkgAndType(name string) (string, string) {
	parts := strings.Split(name, ".")
	if len(parts) == 1 {
		return "", name
	}

	return strings.Join(parts[:len(parts)-1], "."), parts[len(parts)-1]
}

var modsRegex = regexp.MustCompile(`^(\*|\[\])*`)

func NormalizeVendor(pkg string) string {
	modifiers := modsRegex.FindAllString(pkg, 1)[0]
	pkg = strings.TrimPrefix(pkg, modifiers)
	parts := strings.Split(pkg, "/vendor/")
	return modifiers + parts[len(parts)-1]
}

func QualifyPackagePath(importPath string) string {
	wd, _ := os.Getwd()

	// in go module mode, the import path doesn't need fixing
	if _, ok := goModuleRoot(wd); ok {
		return importPath
	}

	pkg, err := build.Import(importPath, wd, 0)
	if err != nil {
		return importPath
	}

	return pkg.ImportPath
}

var invalidPackageNameChar = regexp.MustCompile(`[^\w]`)

func SanitizePackageName(pkg string) string {
	return invalidPackageNameChar.ReplaceAllLiteralString(filepath.Base(pkg), "_")
}
