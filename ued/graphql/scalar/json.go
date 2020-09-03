package scalar

import (
	"encoding/json"
	"fmt"
	"github.com/99designs/gqlgen/graphql"
	"gorm.io/datatypes"
)

func MarshalJson(s datatypes.JSON) graphql.Marshaler {
	return graphql.MarshalAny(s)
}

func UnmarshalJson(v interface{}) (datatypes.JSON, error) {
	if v == nil {
		return datatypes.JSON{}, nil
	}
	b, err := json.Marshal(v)
	if err != nil {
		return datatypes.JSON{}, fmt.Errorf("%T is not a json", v)
	}
	return b, nil
}
